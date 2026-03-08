import rawData from './dsa_questions.json';

export interface TestCase {
  input: Record<string, unknown>;
  expected: unknown;
}

export interface DSAProblem {
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  tags: string[];
  description: string;
  functionSignature: string;
  constraints: string[];
  testCases: TestCase[];
}

interface RawData {
  problems: DSAProblem[];
}

export const dsaProblems: DSAProblem[] = (rawData as RawData).problems;

export const easyProblems = dsaProblems.filter((p) => p.difficulty === 'easy');
export const mediumProblems = dsaProblems.filter((p) => p.difficulty === 'medium');
export const hardProblems = dsaProblems.filter((p) => p.difficulty === 'hard');

/** Extract ordered parameter names from a JS function signature like "function foo(a, b, c)" */
export function getParamNames(signature: string): string[] {
  const match = signature.match(/\(([^)]*)\)/);
  if (!match || !match[1]?.trim()) return [];
  return match[1].split(',').map((s) => s.trim());
}

/** Build a runnable code string that calls the user's function with test-case inputs.
 *  Supports 'javascript' (full auto-test) and 'python' (auto-test via json.loads).
 *  For other languages, returns the user code unchanged (manual testing). */
export function buildTestRunner(problem: DSAProblem, userCode: string, language = 'javascript'): string {
  const params = getParamNames(problem.functionSignature);
  const fnName = getFunctionName(problem.functionSignature);

  if (language === 'python') {
    const cases = problem.testCases
      .map((tc, i) => {
        const args = params
          .map((p) => `_json.loads(${JSON.stringify(JSON.stringify(tc.input[p]))})`)
          .join(', ');
        const expectedStr = JSON.stringify(JSON.stringify(tc.expected));
        return `try:
    _result_${i} = ${fnName}(${args})
    _expected_${i} = _json.loads(${expectedStr})
    _pass_${i} = _json.dumps(_result_${i}, sort_keys=True) == _json.dumps(_expected_${i}, sort_keys=True)
    print(_json.dumps({"case": ${i}, "pass": _pass_${i}, "result": _result_${i}, "expected": _expected_${i}}))
except Exception as _e_${i}:
    print(_json.dumps({"case": ${i}, "pass": False, "error": str(_e_${i})}))`.trim();
      })
      .join('\n\n');
    return `import json as _json\n\n${userCode}\n\n${cases}`;
  }

  if (language !== 'javascript') {
    // Java / C / C++ — return user code as-is, user handles their own output
    return userCode;
  }

  // JavaScript auto-test
  const cases = problem.testCases
    .map((tc, i) => {
      const args = params.map((p) => JSON.stringify(tc.input[p])).join(', ');
      return `try {
  const result${i} = ${fnName}(${args});
  const expected${i} = ${JSON.stringify(tc.expected)};
  const pass${i} = JSON.stringify(result${i}) === JSON.stringify(expected${i});
  console.log(JSON.stringify({ case: ${i}, pass: pass${i}, result: result${i}, expected: expected${i} }));
} catch (e) {
  console.log(JSON.stringify({ case: ${i}, pass: false, error: String(e) }));
}`;
    })
    .join('\n');

  return `${userCode}\n\n${cases}`;
}

export function getFunctionName(signature: string): string {
  const match = signature.match(/function\s+(\w+)/);
  return match?.[1] ?? 'solution';
}
