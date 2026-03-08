import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type RefObject } from 'react';
import { registerCodebattlegroundTheme } from '../../config/monacoTheme';
import type { AppSocket } from '../../types';
import ACTIONS from '../../socket/actions';
import Output from '../output/Output';
import { KbdShortcut } from '../ui/Kbd';
import './CodeEditor.scss';

interface CodeEditorProps {
  socketRef: RefObject<AppSocket | null>;
  roomId: string;
  username: string;
  onCodeChange?: (code: string) => void;
}

const LANGUAGE_OPTIONS = [
  { value: 'cpp', label: 'C++' }, { value: 'c', label: 'C' },
  { value: 'javascript', label: 'JavaScript' }, { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
] as const;

type LangValue = typeof LANGUAGE_OPTIONS[number]['value'];

const CodeEditor = ({ socketRef, roomId, onCodeChange }: CodeEditorProps) => {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState<LangValue>('cpp');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;
    const handleCodeChanged = ({ code: c }: { code: string }) => { if (c !== undefined && c !== code) { setCode(c); onCodeChange?.(c); } };
    const handleLanguageChanged = ({ language: l }: { language: string }) => { if (l !== undefined && l !== language) setLanguage(l as LangValue); };
    const handleSyncCode = ({ code: c, language: l }: { code?: string; language?: string }) => {
      if (c !== undefined) { setCode(c); onCodeChange?.(c); }
      if (l !== undefined) setLanguage(l as LangValue);
    };
    sock.on(ACTIONS.CODE_CHANGED, handleCodeChanged);
    sock.on(ACTIONS.LANGUAGE_CHANGED, handleLanguageChanged);
    sock.on(ACTIONS.SYNC_CODE, handleSyncCode);
    return () => { sock.off(ACTIONS.CODE_CHANGED, handleCodeChanged); sock.off(ACTIONS.LANGUAGE_CHANGED, handleLanguageChanged); sock.off(ACTIONS.SYNC_CODE, handleSyncCode); };
  }, [code, language, onCodeChange, socketRef]);

  const handleCodeChange = useCallback((newCode: string | undefined) => {
    const c = newCode ?? '';
    if (c === code) return;
    setCode(c); onCodeChange?.(c);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, { roomId, code: c });
  }, [code, onCodeChange, roomId, socketRef]);

  const onMount: OnMount = (ed, monaco) => {
    registerCodebattlegroundTheme(monaco); monaco.editor.setTheme('codebattleground');
    editorRef.current = ed; ed.focus();
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const l = e.target.value as LangValue; setLanguage(l);
    socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, language: l });
  };

  return (
    <div className="code-editor">
      <div className="code-editor__toolbar">
        <select className="code-editor__language" value={language} onChange={handleLanguageChange}>
          {LANGUAGE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="code-editor__hint"><span>Run</span><KbdShortcut keys={['Ctrl', 'Enter']} /></div>
      </div>
      <div className="code-editor__split">
        <div className="code-editor__editor">
          <Editor height="100%" language={language} value={code} onChange={handleCodeChange} onMount={onMount} theme="vs-dark"
            options={{ minimap: { enabled: false }, showUnused: false, folding: true, lineNumbersMinChars: 3, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontLigatures: true, scrollBeyondLastLine: false, automaticLayout: true, bracketPairColorization: { enabled: true }, cursorSmoothCaretAnimation: 'on', cursorBlinking: 'smooth', padding: { top: 12, bottom: 12 }, renderLineHighlight: 'line', scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 } }} />
        </div>
        <Output editorRef={editorRef} language={language} socketRef={socketRef} roomId={roomId} />
      </div>
    </div>
  );
};
export default CodeEditor;
