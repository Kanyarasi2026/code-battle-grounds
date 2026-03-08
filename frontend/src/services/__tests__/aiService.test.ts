import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('aiService', () => {
  const mockApiUrl = 'https://api.example.com/v1/chat/completions';
  const mockApiKey = 'test-key-123';
  const mockModel = 'test-model';

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_GEMINI_FETCH_URL', mockApiUrl);
    vi.stubEnv('VITE_GEMINI_API_KEY', mockApiKey);
    vi.stubEnv('VITE_GEMINI_MODEL', mockModel);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('getHint', () => {
    it('returns a hint with correct tier and label', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Think about using a hash map.' } }],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        }),
      );

      const { getHint } = await import('../aiService');
      const result = await getHint('Two Sum', 'Find two numbers...', ['n >= 2'], '', 1);

      expect(result.tier).toBe(1);
      expect(result.label).toBe('Nudge');
      expect(result.content).toBe('Think about using a hash map.');
    });

    it('sends correct tier labels for each tier', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'hint' } }],
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', fetchMock);

      const { getHint } = await import('../aiService');

      const r1 = await getHint('P', 'D', [], '', 1);
      expect(r1.label).toBe('Nudge');

      const r2 = await getHint('P', 'D', [], '', 2);
      expect(r2.label).toBe('Concept');

      const r3 = await getHint('P', 'D', [], '', 3);
      expect(r3.label).toBe('Pseudocode');

      const r4 = await getHint('P', 'D', [], '', 4);
      expect(r4.label).toBe('Solution');
    });

    it('throws when API returns an error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          text: () => Promise.resolve('Internal Server Error'),
        }),
      );

      const { getHint } = await import('../aiService');

      await expect(getHint('P', 'D', [], '', 1)).rejects.toThrow('AI API error: 500');
    });
  });

  describe('chatWithAI', () => {
    it('returns AI response text', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Use a sliding window approach.' } }],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        }),
      );

      const { chatWithAI } = await import('../aiService');
      const result = await chatWithAI(
        'Two Sum',
        'Find two numbers...',
        'function twoSum() {}',
        [],
        'What approach should I use?',
      );

      expect(result).toBe('Use a sliding window approach.');
    });

    it('includes conversation history in request', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ choices: [{ message: { content: 'reply' } }] }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const { chatWithAI } = await import('../aiService');

      await chatWithAI('P', 'D', '', [
        { role: 'user', content: 'Hello', timestamp: new Date() },
        { role: 'assistant', content: 'Hi', timestamp: new Date() },
      ], 'Follow up');

      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
      // system + 2 history + 1 new = 4 messages
      expect(body.messages.length).toBe(4);
    });
  });

  describe('configuration', () => {
    it('throws when env vars are missing', async () => {
      vi.unstubAllEnvs();
      vi.stubEnv('VITE_GEMINI_FETCH_URL', '');
      vi.stubEnv('VITE_GEMINI_API_KEY', '');
      vi.stubEnv('VITE_GEMINI_MODEL', '');

      const { getHint } = await import('../aiService');

      await expect(getHint('P', 'D', [], '', 1)).rejects.toThrow('AI not configured');
    });
  });
});
