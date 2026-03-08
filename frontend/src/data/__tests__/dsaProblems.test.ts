import { describe, it, expect } from 'vitest';
import {
  dsaProblems,
  easyProblems,
  mediumProblems,
  hardProblems,
  getParamNames,
  getFunctionName,
  buildTestRunner,
  type DSAProblem,
} from '../dsaProblems';

// ── Data integrity ────────────────────────────────────────────────────────────

describe('dsaProblems dataset', () => {
  it('contains at least one problem', () => {
    expect(dsaProblems.length).toBeGreaterThan(0);
  });

  it('every problem has required fields', () => {
    for (const p of dsaProblems) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(['easy', 'medium', 'hard']).toContain(p.difficulty);
      expect(p.functionSignature).toBeTruthy();
      expect(p.testCases.length).toBeGreaterThan(0);
    }
  });

  it('slugs are unique', () => {
    const slugs = dsaProblems.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('difficulty filters', () => {
  it('easyProblems contains only easy problems', () => {
    expect(easyProblems.length).toBeGreaterThan(0);
    for (const p of easyProblems) {
      expect(p.difficulty).toBe('easy');
    }
  });

  it('mediumProblems contains only medium problems', () => {
    for (const p of mediumProblems) {
      expect(p.difficulty).toBe('medium');
    }
  });

  it('hardProblems contains only hard problems', () => {
    for (const p of hardProblems) {
      expect(p.difficulty).toBe('hard');
    }
  });

  it('filters account for all problems', () => {
    expect(easyProblems.length + mediumProblems.length + hardProblems.length).toBe(
      dsaProblems.length,
    );
  });
});

// ── getParamNames ─────────────────────────────────────────────────────────────

describe('getParamNames', () => {
  it('extracts params from a standard function signature', () => {
    expect(getParamNames('function twoSum(nums, target)')).toEqual(['nums', 'target']);
  });

  it('handles single parameter', () => {
    expect(getParamNames('function reverse(s)')).toEqual(['s']);
  });

  it('handles no parameters', () => {
    expect(getParamNames('function noop()')).toEqual([]);
  });

  it('handles whitespace around params', () => {
    expect(getParamNames('function f( a , b , c )')).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array when no parentheses found', () => {
    expect(getParamNames('invalid signature')).toEqual([]);
  });
});

// ── getFunctionName ───────────────────────────────────────────────────────────

describe('getFunctionName', () => {
  it('extracts name from a standard signature', () => {
    expect(getFunctionName('function twoSum(nums, target)')).toBe('twoSum');
  });

  it('returns "solution" when no match', () => {
    expect(getFunctionName('invalid')).toBe('solution');
  });

  it('handles extra whitespace', () => {
    expect(getFunctionName('function   myFunc(a)')).toBe('myFunc');
  });
});

// ── buildTestRunner ───────────────────────────────────────────────────────────

describe('buildTestRunner', () => {
  const mockProblem: DSAProblem = {
    slug: 'test-problem',
    title: 'Test Problem',
    difficulty: 'easy',
    topic: 'arrays',
    tags: ['arrays'],
    description: 'A test problem',
    functionSignature: 'function add(a, b)',
    constraints: ['1 <= a, b <= 100'],
    testCases: [
      { input: { a: 1, b: 2 }, expected: 3 },
      { input: { a: 0, b: 0 }, expected: 0 },
    ],
  };

  it('generates JavaScript test runner', () => {
    const code = 'function add(a, b) { return a + b; }';
    const result = buildTestRunner(mockProblem, code, 'javascript');

    expect(result).toContain(code);
    expect(result).toContain('add(1, 2)');
    expect(result).toContain('JSON.stringify');
    expect(result).toContain('case:');
  });

  it('generates Python test runner', () => {
    const code = 'def add(a, b):\n    return a + b';
    const result = buildTestRunner(mockProblem, code, 'python');

    expect(result).toContain('import json as _json');
    expect(result).toContain(code);
    expect(result).toContain('add(');
    expect(result).toContain('_json.dumps');
  });

  it('returns user code as-is for C/C++/Java', () => {
    const code = '#include <stdio.h>\nint main() { return 0; }';

    expect(buildTestRunner(mockProblem, code, 'c')).toBe(code);
    expect(buildTestRunner(mockProblem, code, 'cpp')).toBe(code);
    expect(buildTestRunner(mockProblem, code, 'java')).toBe(code);
  });

  it('defaults to javascript when language omitted', () => {
    const code = 'function add(a, b) { return a + b; }';
    const result = buildTestRunner(mockProblem, code);

    expect(result).toContain('JSON.stringify');
  });
});
