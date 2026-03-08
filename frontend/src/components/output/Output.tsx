import { Copy, Loader2, Play, Trash2 } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type RefObject } from 'react';
import toast from 'react-hot-toast';
import type { editor } from 'monaco-editor';
import { executeCode } from '../../api/api';
import type { AppSocket, Language } from '../../types';
import ACTIONS from '../../socket/actions';
import Button from '../ui/Button';
import './Output.scss';

interface OutputProps {
  editorRef: RefObject<editor.IStandaloneCodeEditor | null>;
  language: Language;
  socketRef: RefObject<AppSocket | null>;
  roomId: string;
}

const Output = ({ editorRef, language, socketRef, roomId }: OutputProps) => {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [stdin, setStdin] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'input'>('output');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); void runCode(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, stdin]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;
    const handleInputChanged = ({ stdin: s }: { stdin: string }) => { if (s !== stdin) setStdin(s); };
    const handleExecutionStarted = ({ username }: { username: string | null }) => { setIsLoading(true); setOutput(''); setActiveTab('output'); toast.success(`${username ?? 'Someone'} is running the code...`); };
    const handleExecutionResult = ({ output: o, isError: e, username: u }: { output: string; isError: boolean; username: string | null }) => {
      setOutput(o); setIsError(e); setIsLoading(false);
      if (e) toast.error(`Code executed by ${u ?? 'someone'} with errors`);
      else toast.success(`Code executed successfully by ${u ?? 'someone'}`);
    };
    const handleSyncCode = ({ stdin: s, output: o, isError: e }: { stdin?: string; output?: string; isError?: boolean }) => {
      if (s !== undefined) setStdin(s);
      if (o !== undefined) { setOutput(o); setIsError(e ?? false); }
    };
    sock.on(ACTIONS.INPUT_CHANGED, handleInputChanged);
    sock.on('executionStarted', handleExecutionStarted);
    sock.on(ACTIONS.EXECUTION_RESULT, handleExecutionResult);
    sock.on(ACTIONS.SYNC_CODE, handleSyncCode);
    return () => {
      sock.off(ACTIONS.INPUT_CHANGED, handleInputChanged);
      sock.off('executionStarted', handleExecutionStarted);
      sock.off(ACTIONS.EXECUTION_RESULT, handleExecutionResult);
      sock.off(ACTIONS.SYNC_CODE, handleSyncCode);
    };
  }, [socketRef, stdin]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const s = e.target.value; setStdin(s);
    socketRef.current?.emit(ACTIONS.INPUT_CHANGE, { roomId, stdin: s });
  };
  const copyOutput = () => { if (!output) return; navigator.clipboard.writeText(output).then(() => toast.success('Output copied')).catch(() => {}); };
  const clearOutput = () => { setOutput(''); setIsError(false); };

  const runCode = async (): Promise<void> => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode?.trim()) { toast.error('No code to run'); return; }
    if (stdin.length > 10000) { toast.error('Input is too large (max 10KB)'); return; }
    try {
      setIsLoading(true); setIsError(false); setOutput(''); setActiveTab('output');
      socketRef.current?.emit(ACTIONS.EXECUTE_CODE, { roomId, code: sourceCode, language, stdin });
      const { run: result } = await executeCode(sourceCode, language, stdin);
      const outputText = result.output || result.stderr || 'No output';
      const hasError = !!result.stderr;
      setOutput(outputText); setIsError(hasError);
      socketRef.current?.emit('executionResult', { roomId, output: outputText, isError: hasError });
      if (hasError) toast.error('Code execution completed with errors');
      else toast.success('Code executed successfully');
    } catch (err) {
      setIsError(true);
      const axiosErr = err as { response?: { status?: number }; code?: string };
      let msg = 'Error running code. Please try again.';
      if (axiosErr.response?.status === 429) msg = 'Rate limit exceeded. Please wait before running again.';
      else if (axiosErr.response?.status === 400) msg = 'Invalid code or input. Please check your code.';
      else if (axiosErr.code === 'ECONNABORTED') msg = 'Request timeout. The code took too long to execute.';
      else if (!axiosErr.response) msg = 'Network error. Please check your connection.';
      toast.error(msg); setOutput(msg);
      socketRef.current?.emit('executionResult', { roomId, output: msg, isError: true });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="output-panel">
      <div className="output-panel__header">
        <div className="output-panel__tabs">
          <button className={`output-panel__tab ${activeTab === 'output' ? 'output-panel__tab--active' : ''}`} onClick={() => setActiveTab('output')}>Output</button>
          <button className={`output-panel__tab ${activeTab === 'input' ? 'output-panel__tab--active' : ''}`} onClick={() => setActiveTab('input')}>Input</button>
        </div>
        <div className="output-panel__actions">
          {activeTab === 'output' && output && (<>
            <button className="output-panel__icon-btn" onClick={copyOutput} title="Copy output"><Copy size={14} /></button>
            <button className="output-panel__icon-btn" onClick={clearOutput} title="Clear output"><Trash2 size={14} /></button>
          </>)}
          <Button variant="primary" size="sm" onClick={() => { void runCode(); }} loading={isLoading} iconLeft={isLoading ? <Loader2 size={14} className="output-panel__spinner" /> : <Play size={14} />}>Run</Button>
        </div>
      </div>
      <div className="output-panel__content">
        {activeTab === 'output'
          ? <pre className={`output-panel__output ${isError ? 'output-panel__output--error' : ''}`}>{output || (isLoading ? 'Running code...' : 'Run your code to see output')}</pre>
          : <textarea className="output-panel__input" placeholder="Enter input for the program (optional)" value={stdin} onChange={handleInputChange} disabled={isLoading} maxLength={10000} />}
      </div>
    </div>
  );
};
export default Output;
