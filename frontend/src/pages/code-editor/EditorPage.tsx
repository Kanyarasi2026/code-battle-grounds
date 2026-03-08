import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Hash, LogOut, Menu, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import CodeEditor from '../../components/editor/CodeEditor';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { useRoom } from '../../context/RoomContext';
import type { AppSocket, Client } from '../../types';
import ACTIONS from '../../socket/actions';
import { initSocket } from '../../socket/socket';
import './EditorPage.scss';

interface LocationState { username?: string; }

const EditorPage = () => {
  const socketRef = useRef<AppSocket | null>(null);
  const codeRef = useRef<string | null>(null);
  const location = useLocation();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeRoomId, activeUsername, isInRoom, joinRoom, leaveRoom } = useRoom();

  const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const hasValidRoomId = !!roomId && isValidUUID(roomId);
  const isRefresh = isInRoom && activeRoomId === roomId;
  const state = location.state as LocationState | null;
  const username = state?.username ?? (isRefresh ? activeUsername : null);
  const hasValidState = !!username;

  useEffect(() => {
    if (!hasValidRoomId || !hasValidState || !roomId || !username) return;
    let mounted = true;
    const init = async (): Promise<void> => {
      let socket: AppSocket;
      try { socket = await initSocket(); } catch (e) {
        if (!mounted) return;
        console.error('Failed to initialize socket:', e);
        leaveRoom(); toast.error('Authentication failed. Please sign in again.'); navigate('/'); return;
      }
      if (!mounted) { socket.disconnect(); return; }
      socketRef.current = socket;
      const handleErrors = () => {
        if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
        leaveRoom(); toast.error('Socket connection failed, try again later.'); navigate('/');
      };
      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect', () => {
        socketRef.current?.emit(ACTIONS.JOIN, { roomId, username });
        joinRoom(roomId, username);
      });
      socketRef.current.on(ACTIONS.JOINED, ({ clients: c, username: joinedUser }) => {
        if (joinedUser !== username) toast.success(`${joinedUser} joined the room.`);
        const byEmail = new Map<string, Client>();
        const noEmail: Client[] = [];
        for (const cl of c) { if (cl.userEmail) byEmail.set(cl.userEmail, cl); else noEmail.push(cl); }
        setClients([...byEmail.values(), ...noEmail]);
      });
      socketRef.current.on(ACTIONS.LEFT, ({ socketId, username: leftUser }) => {
        toast.success(`${leftUser ?? 'Someone'} left the room.`);
        setClients((prev) => prev.filter((c) => c.socketId !== socketId));
      });
      socketRef.current.on(ACTIONS.ALREADY_IN_ROOM, () => {
        if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
        navigate('/already-in-room', { replace: true });
      });
    };
    void init();
    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED); socketRef.current.off(ACTIONS.LEFT);
        socketRef.current.off(ACTIONS.ALREADY_IN_ROOM); socketRef.current.off('connect');
        socketRef.current.off('connect_error'); socketRef.current.disconnect(); socketRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidRoomId, hasValidState, roomId, username]);

  const copyRoomId = async (): Promise<void> => {
    try { await navigator.clipboard.writeText(roomId ?? ''); toast.success('Room ID copied'); }
    catch { toast.error('Could not copy the Room ID'); }
  };
  const handleLeave = () => { leaveRoom(); navigate('/'); };

  if (!hasValidRoomId || !hasValidState || !roomId || !username) {
    return <Navigate to="/" replace state={{ toastMessage: 'Please join rooms from the home page.' }} />;
  }

  return (
    <div className="editor-page">
      <header className="editor-page__header">
        <div className="editor-page__header-left">
          <button className="editor-page__menu-btn" onClick={() => setSidebarOpen((p) => !p)}>{sidebarOpen ? <X size={16} /> : <Menu size={16} />}</button>
          <span className="editor-page__brand">Code<span>Battlegrounds</span></span>
          <span className="editor-page__room-badge"><Hash size={12} />{roomId.slice(0, 8)}</span>
        </div>
        <div className="editor-page__header-right">
          <div className="editor-page__avatars">
            {clients.slice(0, 5).map((c) => <Avatar key={c.socketId} username={c.username} size="sm" showStatus />)}
            {clients.length > 5 && <span className="editor-page__avatar-overflow">+{clients.length - 5}</span>}
          </div>
          <Button variant="ghost" size="sm" iconLeft={<Copy size={14} />} onClick={() => { void copyRoomId(); }}>Invite</Button>
          <Button variant="ghost" size="sm" iconLeft={<LogOut size={14} />} onClick={handleLeave}>Leave</Button>
        </div>
      </header>
      <div className="editor-page__body">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside className="editor-page__sidebar" initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="editor-page__sidebar-inner">
                <div className="editor-page__sidebar-section">
                  <h4><Users size={14} /> Members ({clients.length})</h4>
                  <ul className="editor-page__members">
                    <AnimatePresence>
                      {clients.map((c) => (
                        <motion.li key={c.socketId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="editor-page__member">
                          <Avatar username={c.username} size="sm" showStatus />
                          <span>{c.username}</span>
                          {c.username === username && <span className="editor-page__you-badge">you</span>}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        <main className="editor-page__main">
          <CodeEditor socketRef={socketRef} roomId={roomId} username={username} onCodeChange={(code) => { codeRef.current = code; }} />
        </main>
      </div>
    </div>
  );
};
export default EditorPage;
