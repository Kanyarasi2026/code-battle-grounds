import { describe, it, expect, vi } from 'vitest';
import codebattlegroundTheme, { registerCodebattlegroundTheme } from '../monacoTheme';

describe('monacoTheme', () => {
  describe('codebattlegroundTheme', () => {
    it('uses vs-dark as base', () => {
      expect(codebattlegroundTheme.base).toBe('vs-dark');
    });

    it('inherits from base theme', () => {
      expect(codebattlegroundTheme.inherit).toBe(true);
    });

    it('has syntax highlighting rules', () => {
      expect(codebattlegroundTheme.rules.length).toBeGreaterThan(0);

      const tokenNames = codebattlegroundTheme.rules.map((r) => r.token);
      expect(tokenNames).toContain('comment');
      expect(tokenNames).toContain('keyword');
      expect(tokenNames).toContain('string');
      expect(tokenNames).toContain('number');
      expect(tokenNames).toContain('function');
    });

    it('has editor colors defined', () => {
      expect(codebattlegroundTheme.colors['editor.background']).toBe('#0a0a0b');
      expect(codebattlegroundTheme.colors['editor.foreground']).toBe('#e4e4e7');
    });

    it('all rule foreground values are valid hex (no # prefix)', () => {
      for (const rule of codebattlegroundTheme.rules) {
        if (rule.foreground) {
          expect(rule.foreground).toMatch(/^[0-9a-fA-F]{6}$/);
        }
      }
    });
  });

  describe('registerCodebattlegroundTheme', () => {
    it('calls monaco.editor.defineTheme with correct args', () => {
      const defineTheme = vi.fn();
      const mockMonaco = { editor: { defineTheme } } as never;

      registerCodebattlegroundTheme(mockMonaco);

      expect(defineTheme).toHaveBeenCalledOnce();
      expect(defineTheme).toHaveBeenCalledWith('codebattleground', codebattlegroundTheme);
    });
  });
});
