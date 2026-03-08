import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeCode } from '../api';
import type { Language } from '../../types';

// Mock axios
vi.mock('axios', () => {
  const mockPost = vi.fn();
  const mockCreate = vi.fn(() => ({
    post: mockPost,
    interceptors: {
      response: { use: vi.fn() },
      request: { use: vi.fn() },
    },
  }));
  return {
    default: { create: mockCreate },
    __mockPost: mockPost,
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockPost: any;

beforeEach(async () => {
  vi.clearAllMocks();
  const axios = await import('axios');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockPost = (axios as any).__mockPost;
});

describe('executeCode', () => {
  it('sends correct payload for javascript', async () => {
    const mockResponse = {
      data: { run: { stdout: 'hello', stderr: '', code: 0 } },
    };
    mockPost.mockResolvedValue(mockResponse);

    const result = await executeCode('console.log("hello")', 'javascript');

    expect(result).toEqual(mockResponse.data);
    expect(mockPost).toHaveBeenCalledWith('/execute', expect.objectContaining({
      language: 'javascript',
      files: [{ content: 'console.log("hello")' }],
    }));
  });

  it('throws on empty source code', async () => {
    await expect(executeCode('', 'javascript')).rejects.toThrow('Invalid source code');
  });

  it('throws on unsupported language', async () => {
    await expect(executeCode('code', 'rust' as Language)).rejects.toThrow(
      'Unsupported language',
    );
  });

  it('passes stdin when provided', async () => {
    const mockResponse = {
      data: { run: { stdout: '42', stderr: '', code: 0 } },
    };
    mockPost.mockResolvedValue(mockResponse);

    await executeCode('code', 'python', '42');

    expect(mockPost).toHaveBeenCalledWith('/execute', expect.objectContaining({
      stdin: '42',
    }));
  });

  it('converts non-string stdin to string', async () => {
    const mockResponse = {
      data: { run: { stdout: '', stderr: '', code: 0 } },
    };
    mockPost.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await executeCode('code', 'python', 123 as any);

    expect(mockPost).toHaveBeenCalledWith('/execute', expect.objectContaining({
      stdin: '123',
    }));
  });
});
