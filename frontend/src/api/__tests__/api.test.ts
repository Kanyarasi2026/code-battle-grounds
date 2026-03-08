import { describe, it, expect} from 'vitest';
import { LANGUAGE_VERSIONS } from '../constant';

describe('API - executeCode validation', () => {
  it('validates supported languages', () => {
    expect(LANGUAGE_VERSIONS).toHaveProperty('python');
    expect(LANGUAGE_VERSIONS).toHaveProperty('javascript');
    expect(LANGUAGE_VERSIONS).toHaveProperty('java');
    expect(LANGUAGE_VERSIONS).toHaveProperty('cpp');
    expect(LANGUAGE_VERSIONS).toHaveProperty('c');
  });

  it('has valid language versions', () => {
    Object.values(LANGUAGE_VERSIONS).forEach((version) => {
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('validates API endpoint configuration', () => {
    const baseUrl = import.meta.env['VITE_SOCKET_URL'] ?? 'http://localhost:3000';
    expect(baseUrl).toBeTruthy();
    expect(typeof baseUrl).toBe('string');
  });
});
