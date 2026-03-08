import { describe, expect, it } from 'vitest';
import { schemas, validate } from '../middleware/validation.js';

const VALID_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

// Helper: assert that validate throws with a message matching the pattern
const expectValidationError = (schema: Parameters<typeof validate>[0], data: unknown, match: string) => {
  expect(() => validate(schema, data)).toThrow(match);
};

// ── join schema ───────────────────────────────────────────────
describe('schemas.join', () => {
  it('accepts valid roomId and username', () => {
    const result = validate(schemas.join, { roomId: VALID_UUID, username: 'Alice_01' });
    expect(result).toEqual({ roomId: VALID_UUID, username: 'Alice_01' });
  });

  it('trims unknown fields (stripUnknown)', () => {
    const result = validate(schemas.join, {
      roomId: VALID_UUID,
      username: 'Alice',
      extra: 'ignored',
    });
    expect(result).not.toHaveProperty('extra');
  });

  it('rejects a non-UUID roomId', () => {
    expectValidationError(schemas.join, { roomId: 'not-a-uuid', username: 'Alice' }, 'Invalid room ID format');
  });

  it('rejects a missing roomId', () => {
    expectValidationError(schemas.join, { username: 'Alice' }, 'Room ID is required');
  });

  it('rejects a username shorter than 2 characters', () => {
    expectValidationError(schemas.join, { roomId: VALID_UUID, username: 'A' }, 'at least 2 characters');
  });

  it('rejects a username longer than 30 characters', () => {
    expectValidationError(
      schemas.join,
      { roomId: VALID_UUID, username: 'A'.repeat(31) },
      'cannot exceed 30 characters',
    );
  });

  it('rejects a username with special characters', () => {
    expectValidationError(
      schemas.join,
      { roomId: VALID_UUID, username: 'Alice<script>' },
      'letters, numbers, underscores',
    );
  });

  it('accepts usernames with spaces', () => {
    const result = validate(schemas.join, { roomId: VALID_UUID, username: 'Alice Bob' });
    expect(result.username).toBe('Alice Bob');
  });
});

// ── codeChange schema ─────────────────────────────────────────
describe('schemas.codeChange', () => {
  it('accepts valid roomId and code', () => {
    const result = validate(schemas.codeChange, { roomId: VALID_UUID, code: 'print("hi")' });
    expect(result).toEqual({ roomId: VALID_UUID, code: 'print("hi")' });
  });

  it('accepts an empty string for code', () => {
    const result = validate(schemas.codeChange, { roomId: VALID_UUID, code: '' });
    expect(result.code).toBe('');
  });

  it('rejects code exceeding 100 000 characters', () => {
    expectValidationError(
      schemas.codeChange,
      { roomId: VALID_UUID, code: 'x'.repeat(100_001) },
      'cannot exceed 100KB',
    );
  });

  it('rejects an invalid roomId', () => {
    expectValidationError(schemas.codeChange, { roomId: 'bad', code: '' }, '"roomId" must be a valid GUID');
  });
});

// ── languageChange schema ─────────────────────────────────────
describe('schemas.languageChange', () => {
  const validLanguages = ['cpp', 'c', 'javascript', 'java', 'python'];

  validLanguages.forEach((lang) => {
    it(`accepts language "${lang}"`, () => {
      const result = validate(schemas.languageChange, { roomId: VALID_UUID, language: lang });
      expect(result.language).toBe(lang);
    });
  });

  it('rejects an unsupported language', () => {
    expectValidationError(
      schemas.languageChange,
      { roomId: VALID_UUID, language: 'ruby' },
      'Invalid programming language',
    );
  });

  it('rejects a missing language', () => {
    expectValidationError(schemas.languageChange, { roomId: VALID_UUID }, '"language" is required');
  });
});

// ── executeCode schema ────────────────────────────────────────
describe('schemas.executeCode', () => {
  const base = {
    roomId: VALID_UUID,
    code: 'print("hello")',
    language: 'python',
  };

  it('accepts valid data without stdin', () => {
    const result = validate(schemas.executeCode, base);
    expect(result.language).toBe('python');
    expect(result.stdin).toBeUndefined();
  });

  it('accepts valid data with optional stdin', () => {
    const result = validate(schemas.executeCode, { ...base, stdin: '42\n' });
    expect(result.stdin).toBe('42\n');
  });

  it('rejects an unsupported language', () => {
    expectValidationError(schemas.executeCode, { ...base, language: 'go' }, '"language" must be one of');
  });

  it('rejects a missing code field', () => {
    const { code: _omit, ...noCode } = base;
    expectValidationError(schemas.executeCode, noCode, '"code" is required');
  });

  it('rejects stdin exceeding 10 000 characters', () => {
    expectValidationError(
      schemas.executeCode,
      { ...base, stdin: 's'.repeat(10_001) },
      '"stdin" length must be less than or equal to 10000',
    );
  });
});

// ── inputChange schema ────────────────────────────────────────
describe('schemas.inputChange', () => {
  it('accepts valid roomId and stdin', () => {
    const result = validate(schemas.inputChange, { roomId: VALID_UUID, stdin: 'hello' });
    expect(result.stdin).toBe('hello');
  });

  it('accepts an empty string for stdin', () => {
    const result = validate(schemas.inputChange, { roomId: VALID_UUID, stdin: '' });
    expect(result.stdin).toBe('');
  });

  it('rejects stdin exceeding 10 000 characters', () => {
    expectValidationError(
      schemas.inputChange,
      { roomId: VALID_UUID, stdin: 'x'.repeat(10_001) },
      '"stdin" length must be less than or equal to 10000',
    );
  });

  it('rejects a missing stdin field', () => {
    expectValidationError(schemas.inputChange, { roomId: VALID_UUID }, '"stdin" is required');
  });
});
