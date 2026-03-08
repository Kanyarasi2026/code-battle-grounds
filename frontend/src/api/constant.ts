import type { Language } from '../types';

export const LANGUAGE_VERSIONS: Record<Language, string> = {
  cpp: '10.2.0',
  c: '10.2.0',
  javascript: '18.15.0',
  java: '15.0.2',
  python: '3.10.0',
};

export const CODE_SNIPPETS: Record<Language, string> = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}`,
  c: `#include <stdio.h>\nint main() {\n\tprintf("Hello, World!");\n\treturn 0;\n}`,
  javascript: `console.log("Hello, World!");`,
  java: `class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}`,
  python: `print("Hello, World!")`,
};
