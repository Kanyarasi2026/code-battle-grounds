const ACTIONS = {
  JOIN: 'join',
  JOINED: 'userJoined',
  LEAVE: 'leave',
  LEFT: 'userLeft',
  CODE_CHANGE: 'codeChange',
  CODE_CHANGED: 'codeChanged',
  SYNC_CODE: 'syncCode',
  LANGUAGE_CHANGE: 'languageChange',
  LANGUAGE_CHANGED: 'languageChanged',
  EXECUTE_CODE: 'executeCode',
  EXECUTION_RESULT: 'executionResult',
  INPUT_CHANGE: 'inputChange',
  INPUT_CHANGED: 'inputChanged',
  DISCONNECTED: 'disconnect',
  ERROR: 'error',
  ALREADY_IN_ROOM: 'alreadyInRoom',
} as const;

export default ACTIONS;
