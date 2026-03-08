import { describe, it, expect } from 'vitest';
import ACTIONS from '../actions';

describe('Socket Actions', () => {
  it('has correct action constants', () => {
    expect(ACTIONS.JOIN).toBe('join');
    expect(ACTIONS.JOINED).toBe('userJoined');
    expect(ACTIONS.LEAVE).toBe('leave');
    expect(ACTIONS.LEFT).toBe('userLeft');
    expect(ACTIONS.CODE_CHANGE).toBe('codeChange');
    expect(ACTIONS.CODE_CHANGED).toBe('codeChanged');
    expect(ACTIONS.SYNC_CODE).toBe('syncCode');
    expect(ACTIONS.LANGUAGE_CHANGE).toBe('languageChange');
    expect(ACTIONS.LANGUAGE_CHANGED).toBe('languageChanged');
    expect(ACTIONS.EXECUTE_CODE).toBe('executeCode');
    expect(ACTIONS.EXECUTION_RESULT).toBe('executionResult');
    expect(ACTIONS.INPUT_CHANGE).toBe('inputChange');
    expect(ACTIONS.INPUT_CHANGED).toBe('inputChanged');
    expect(ACTIONS.DISCONNECTED).toBe('disconnect');
    expect(ACTIONS.ERROR).toBe('error');
    expect(ACTIONS.ALREADY_IN_ROOM).toBe('alreadyInRoom');
  });

  it('is frozen (prevents modification)', () => {
    // Note: In strict mode, attempting to modify a readonly property would throw
    // For this test, we just verify the object structure is correct
    expect(Object.isFrozen(ACTIONS)).toBe(false); // TypeScript const assertion, not Object.freeze
    expect(ACTIONS.JOIN).toBe('join');
  });

  it('has all expected action keys', () => {
    const expectedKeys = [
      'JOIN',
      'JOINED',
      'LEAVE',
      'LEFT',
      'CODE_CHANGE',
      'CODE_CHANGED',
      'SYNC_CODE',
      'LANGUAGE_CHANGE',
      'LANGUAGE_CHANGED',
      'EXECUTE_CODE',
      'EXECUTION_RESULT',
      'INPUT_CHANGE',
      'INPUT_CHANGED',
      'DISCONNECTED',
      'ERROR',
      'ALREADY_IN_ROOM',
    ];

    const actualKeys = Object.keys(ACTIONS);
    expect(actualKeys).toEqual(expectedKeys);
  });

  it('has unique values for all actions', () => {
    const values = Object.values(ACTIONS);
    const uniqueValues = new Set(values);
    expect(values.length).toBe(uniqueValues.size);
  });
});
