import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

// Mock logger to silence output during tests
vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Mock roomManager so tests are isolated from the singleton state
const mockGetStats = vi.fn(() => ({ totalRooms: 0, totalClients: 0 }));
const mockRoomExists = vi.fn(() => false);

vi.mock('../utils/roomManager.js', () => ({
  roomManager: {
    getStats: mockGetStats,
    roomExists: mockRoomExists,
  },
}));

// Import createApp after mocks are set up
const { createApp } = await import('../app.js');

describe('GET /health', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
    mockGetStats.mockReturnValue({ totalRooms: 3, totalClients: 7 });
  });

  it('returns 200 with status "healthy"', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('includes uptime, timestamp, rooms, clients, and memory fields', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toMatchObject({
      status: 'healthy',
      rooms: 3,
      clients: 7,
    });
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
    expect(typeof res.body.memory?.used).toBe('number');
    expect(typeof res.body.memory?.total).toBe('number');
  });
});

describe('GET /metrics', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
    mockGetStats.mockReturnValue({ totalRooms: 2, totalClients: 5 });
  });

  it('returns 200 with text/plain content-type', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
  });

  it('contains Prometheus gauge metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.text).toContain('codesketch_rooms_total 2');
    expect(res.text).toContain('codesketch_clients_total 5');
    expect(res.text).toContain('codesketch_uptime_seconds');
  });

  it('includes HELP and TYPE annotations', async () => {
    const res = await request(app).get('/metrics');
    expect(res.text).toContain('# HELP codesketch_rooms_total');
    expect(res.text).toContain('# TYPE codesketch_rooms_total gauge');
  });
});

describe('GET /room/:roomId/exists', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  it('returns { exists: false } when room does not exist', async () => {
    mockRoomExists.mockReturnValue(false);
    const res = await request(app).get('/room/test-room-id/exists');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exists: false });
  });

  it('returns { exists: true } when room exists', async () => {
    mockRoomExists.mockReturnValue(true);
    const res = await request(app).get('/room/some-room/exists');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exists: true });
  });
});

describe('POST /execute', () => {
  let app: Express;

  const validBody = {
    language: 'python',
    files: [{ content: 'print("hello")' }],
  };

  const mockJudge0Response = {
    stdout: 'hello\n',
    stderr: '',
    compile_output: '',
    status: { description: 'Accepted', id: 3 },
  };

  beforeEach(() => {
    app = createApp();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when language is missing', async () => {
    const res = await request(app)
      .post('/execute')
      .send({ files: [{ content: 'code' }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request body');
  });

  it('returns 400 when files array is empty', async () => {
    const res = await request(app)
      .post('/execute')
      .send({ language: 'python', files: [] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request body');
  });

  it('returns 400 for an unsupported language', async () => {
    const res = await request(app)
      .post('/execute')
      .send({ language: 'ruby', files: [{ content: 'puts "hi"' }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Unsupported language/);
  });

  it('proxies to Judge0 and returns piston-compatible response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockJudge0Response,
      }),
    );

    const res = await request(app).post('/execute').send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.run).toMatchObject({
      stdout: 'hello\n',
      code: 0,
    });
  });

  it('returns 502 when Judge0 responds with a non-OK status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: async () => 'Service Unavailable',
      }),
    );

    const res = await request(app).post('/execute').send(validBody);

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('Code execution service error');
  });

  it('returns 429 when Judge0 responds with 429', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => 'Too Many Requests',
      }),
    );

    const res = await request(app).post('/execute').send(validBody);
    expect(res.status).toBe(429);
  });

  it('returns 504 when Judge0 times out', async () => {
    const timeoutError = new Error('Timeout');
    timeoutError.name = 'TimeoutError';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(timeoutError));

    const res = await request(app).post('/execute').send(validBody);
    expect(res.status).toBe(504);
    expect(res.body.error).toMatch(/timed out/);
  });

  it('sets exit code 0 for Accepted status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          stdout: 'ok',
          stderr: '',
          compile_output: '',
          status: { description: 'Accepted', id: 3 },
        }),
      }),
    );

    const res = await request(app).post('/execute').send(validBody);
    expect(res.body.run.code).toBe(0);
  });

  it('sets exit code 1 for non-Accepted status with id >= 6', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          stdout: '',
          stderr: 'Runtime Error',
          compile_output: '',
          status: { description: 'Runtime Error (SIGSEGV)', id: 11 },
        }),
      }),
    );

    const res = await request(app).post('/execute').send(validBody);
    expect(res.body.run.code).toBe(1);
  });

  it('merges compile_output and stderr into run.stderr', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          stdout: '',
          stderr: 'runtime err',
          compile_output: 'compile err',
          status: { description: 'Compilation Error', id: 6 },
        }),
      }),
    );

    const res = await request(app).post('/execute').send(validBody);
    expect(res.body.run.stderr).toContain('compile err');
    expect(res.body.run.stderr).toContain('runtime err');
  });

  it('passes stdin to Judge0 when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockJudge0Response,
    });
    vi.stubGlobal('fetch', fetchMock);

    await request(app)
      .post('/execute')
      .send({ ...validBody, stdin: '42\n' });

    const body = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(body.stdin).toBe('42\n');
  });
});
