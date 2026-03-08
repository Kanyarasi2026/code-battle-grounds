import { describe, it, expect } from 'vitest';
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from '../constant';

describe('API Constants', () => {
  describe('LANGUAGE_VERSIONS', () => {
    it('has all required language versions', () => {
      expect(LANGUAGE_VERSIONS).toHaveProperty('cpp');
      expect(LANGUAGE_VERSIONS).toHaveProperty('c');
      expect(LANGUAGE_VERSIONS).toHaveProperty('javascript');
      expect(LANGUAGE_VERSIONS).toHaveProperty('java');
      expect(LANGUAGE_VERSIONS).toHaveProperty('python');
    });

    it('has valid version strings', () => {
      Object.values(LANGUAGE_VERSIONS).forEach((version) => {
        expect(typeof version).toBe('string');
        expect(version.length).toBeGreaterThan(0);
        expect(version).toMatch(/^\d+\.\d+\.\d+$/);
      });
    });

    it('has correct number of languages', () => {
      expect(Object.keys(LANGUAGE_VERSIONS)).toHaveLength(5);
    });
  });

  describe('CODE_SNIPPETS', () => {
    it('has all required language snippets', () => {
      expect(CODE_SNIPPETS).toHaveProperty('cpp');
      expect(CODE_SNIPPETS).toHaveProperty('c');
      expect(CODE_SNIPPETS).toHaveProperty('javascript');
      expect(CODE_SNIPPETS).toHaveProperty('java');
      expect(CODE_SNIPPETS).toHaveProperty('python');
    });

    it('has non-empty code snippets', () => {
      Object.values(CODE_SNIPPETS).forEach((snippet) => {
        expect(typeof snippet).toBe('string');
        expect(snippet.length).toBeGreaterThan(0);
      });
    });

    it('has correct number of snippets', () => {
      expect(Object.keys(CODE_SNIPPETS)).toHaveLength(5);
    });

    it('has matching languages between versions and snippets', () => {
      const versionLanguages = Object.keys(LANGUAGE_VERSIONS);
      const snippetLanguages = Object.keys(CODE_SNIPPETS);
      expect(versionLanguages.sort()).toEqual(snippetLanguages.sort());
    });

    it('cpp snippet contains valid C++ code', () => {
      expect(CODE_SNIPPETS.cpp).toContain('#include <iostream>');
      expect(CODE_SNIPPETS.cpp).toContain('int main()');
    });

    it('c snippet contains valid C code', () => {
      expect(CODE_SNIPPETS.c).toContain('#include <stdio.h>');
      expect(CODE_SNIPPETS.c).toContain('int main()');
    });

    it('javascript snippet contains valid JS code', () => {
      expect(CODE_SNIPPETS.javascript).toContain('console.log');
    });

    it('java snippet contains valid Java code', () => {
      expect(CODE_SNIPPETS.java).toContain('class Main');
      expect(CODE_SNIPPETS.java).toContain('public static void main');
    });

    it('python snippet contains valid Python code', () => {
      expect(CODE_SNIPPETS.python).toContain('print');
    });

    it('all snippets contain "Hello, World!"', () => {
      Object.values(CODE_SNIPPETS).forEach((snippet) => {
        expect(snippet).toContain('Hello, World!');
      });
    });
  });
});
