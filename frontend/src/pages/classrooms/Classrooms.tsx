import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Copy,
  LogIn,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import ParticleField from '../../components/effects/ParticleField';
import { useAuth } from '../../context/AuthContext';
import { useNavStack } from '../../context/NavigationStackContext';
import './Classrooms.scss';

interface RecentClassroom {
  roomId: string;
  name: string;
  joinedAt: number;
  role: 'host' | 'participant';
}

const RECENT_KEY = 'codebattleground-recent-classrooms';
const MAX_RECENT = 8;

function getRecentClassrooms(): RecentClassroom[] {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RecentClassroom[];
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch { /* empty */ }
  return [];
}

function saveRecentClassroom(entry: RecentClassroom) {
  const existing = getRecentClassrooms().filter((c) => c.roomId !== entry.roomId);
  const updated = [entry, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function removeRecentClassroom(roomId: string) {
  const updated = getRecentClassrooms().filter((c) => c.roomId !== roomId);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const Classrooms = () => {
  const navigate = useNavigate();
  useNavStack(); // keep provider in context
  const { user, roleData } = useAuth();
  const isFaculty = roleData.requested === 'faculty';

  const [roomId, setRoomId] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [username, setUsername] = useState(
    (user?.user_metadata?.['full_name'] as string | undefined) ?? user?.email ?? ''
  );
  const [isJoining, setIsJoining] = useState(false);
  const [recentClassrooms, setRecentClassrooms] = useState<RecentClassroom[]>(getRecentClassrooms);


  const isValidUUID = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const validateUsername = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) return 'Name must be at least 2 characters';
    if (trimmed.length > 30) return 'Name cannot exceed 30 characters';
    if (!/^[a-zA-Z0-9_\s]+$/.test(trimmed)) return 'Only letters, numbers, spaces, and underscores allowed';
    return null;
  };

  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  const createClassroom = (e: FormEvent) => {
    e.preventDefault();
    const nameError = validateUsername(username);
    if (nameError) { toast.error(nameError); return; }

    const id = v4();
    const name = classroomName.trim() || 'Untitled Classroom';

    saveRecentClassroom({
      roomId: id,
      name,
      joinedAt: Date.now(),
      role: 'host',
    });

    setCreatedRoomId(id);
    navigator.clipboard
      .writeText(id)
      .then(() => toast.success('Classroom ID copied — share it with your students!'))
      .catch(() => {});
  };

  const enterCreatedClassroom = () => {
    if (!createdRoomId) return;
    navigate(`/editor/${createdRoomId}`, { state: { username: username.trim() } });
  };

  const joinClassroom = async (): Promise<void> => {
    if (!roomId || !username) {
      toast.error('Room ID & name are required');
      return;
    }
    const r = roomId.trim();
    const u = username.trim();
    const nameError = validateUsername(u);
    if (nameError) { toast.error(nameError); return; }
    if (!isValidUUID(r)) { toast.error('Invalid Classroom ID format'); return; }
    if (isJoining) return;

    setIsJoining(true);
    try {
      const BACKEND_URL = import.meta.env['VITE_SOCKET_URL'] ?? 'http://localhost:3000';
      const res = await fetch(`${BACKEND_URL}/room/${encodeURIComponent(r)}/exists`);
      if (!res.ok) throw new Error('Failed to validate classroom');
      const data = (await res.json()) as { exists: boolean };
      if (!data.exists) {
        toast.error('Classroom does not exist. Check the ID or create a new one.');
        setIsJoining(false);
        return;
      }

      saveRecentClassroom({
        roomId: r,
        name: `Classroom ${r.slice(0, 8)}`,
        joinedAt: Date.now(),
        role: 'participant',
      });

      navigate(`/editor/${r}`, { state: { username: u } });
    } catch {
      toast.error('Failed to validate classroom. Please try again.');
      setIsJoining(false);
    }
  };

  const handleInputEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') void joinClassroom();
  };

  const rejoinClassroom = async (classroom: RecentClassroom) => {
    setIsJoining(true);
    try {
      const BACKEND_URL = import.meta.env['VITE_SOCKET_URL'] ?? 'http://localhost:3000';
      const res = await fetch(`${BACKEND_URL}/room/${encodeURIComponent(classroom.roomId)}/exists`);
      if (!res.ok) throw new Error('Failed to validate');
      const data = (await res.json()) as { exists: boolean };
      if (!data.exists) {
        toast.error('This classroom is no longer active');
        handleRemoveRecent(classroom.roomId);
        setIsJoining(false);
        return;
      }
      navigate(`/editor/${classroom.roomId}`, { state: { username: username.trim() } });
    } catch {
      toast.error('Could not reconnect to classroom');
      setIsJoining(false);
    }
  };

  const handleRemoveRecent = (id: string) => {
    removeRecentClassroom(id);
    setRecentClassrooms((prev) => prev.filter((c) => c.roomId !== id));
  };

  const copyClassroomId = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => toast.success('Classroom ID copied'))
      .catch(() => {});
  };

  return (
    <div className="classrooms">
      {/* Background effects */}
      <div className="classrooms__background">
        <ParticleField />
        <div className="classrooms__grid-bg" />
        <div className="classrooms__orb classrooms__orb--1" />
        <div className="classrooms__orb classrooms__orb--2" />
      </div>

      <div className="classrooms__container">
        {/* Header */}
        <div className="classrooms__header">
          <motion.div
            className="classrooms__hero-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Users size={32} strokeWidth={1.5} />
          </motion.div>
          <motion.h1
            className="classrooms__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Classrooms
          </motion.h1>
          <motion.p
            className="classrooms__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isFaculty
              ? 'Create a classroom and share the code with your students'
              : 'Join a classroom using the code from your instructor'}
          </motion.p>
        </div>

        {/* Action cards */}
        <div className={`classrooms__actions ${isFaculty ? 'classrooms__actions--single' : 'classrooms__actions--single'}`}>
          {/* Faculty: Create Classroom */}
          {isFaculty && (
            <div className="classrooms__action-card">
              <Card
                className="classrooms__card"
                header={
                  <div className="classrooms__card-header">
                    <div className="classrooms__card-icon classrooms__card-icon--create">
                      <Plus size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="classrooms__card-title">Create Classroom</h3>
                      <p className="classrooms__card-desc">Start a session and share the code with students</p>
                    </div>
                  </div>
                }
              >
                <form className="classrooms__form" onSubmit={createClassroom}>
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  />
                  <Input
                    label="Classroom Name"
                    placeholder="e.g. CS101 Lab Session"
                    value={classroomName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setClassroomName(e.target.value)}
                  />
                  {!createdRoomId && (
                    <Button
                      variant="primary"
                      type="submit"
                      className="classrooms__btn"
                      iconLeft={<Sparkles size={14} />}
                    >
                      Create Classroom
                    </Button>
                  )}
                </form>

                {/* Show generated room ID after creation */}
                {createdRoomId && (
                  <motion.div
                    className="classrooms__created"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="classrooms__created-label">Classroom ID — share this with your students:</p>
                    <div className="classrooms__created-id">
                      <code>{createdRoomId}</code>
                      <button
                        className="classrooms__copy-btn"
                        onClick={() => copyClassroomId(createdRoomId)}
                        title="Copy ID"
                        type="button"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <Button
                      variant="primary"
                      className="classrooms__btn"
                      onClick={enterCreatedClassroom}
                      iconRight={<ArrowRight size={16} />}
                    >
                      Enter Classroom
                    </Button>
                  </motion.div>
                )}
              </Card>
            </div>
          )}

          {/* Student: Join Classroom */}
          {!isFaculty && (
            <div className="classrooms__action-card">
              <Card
                className="classrooms__card"
                header={
                  <div className="classrooms__card-header">
                    <div className="classrooms__card-icon classrooms__card-icon--join">
                      <LogIn size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="classrooms__card-title">Join Classroom</h3>
                      <p className="classrooms__card-desc">Enter the code your instructor shared</p>
                    </div>
                  </div>
                }
              >
                <div className="classrooms__form">
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    onKeyUp={handleInputEnter}
                    disabled={isJoining}
                  />
                  <Input
                    label="Classroom ID"
                    placeholder="Paste the code from your instructor"
                    value={roomId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
                    onKeyUp={handleInputEnter}
                    disabled={isJoining}
                  />
                  <Button
                    variant="primary"
                    className="classrooms__btn"
                    onClick={() => { void joinClassroom(); }}
                    loading={isJoining}
                    iconRight={<ArrowRight size={16} />}
                  >
                    Join Classroom
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Recent classrooms */}
        <AnimatePresence>
          {recentClassrooms.length > 0 && (
            <motion.div
              className="classrooms__recent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="classrooms__recent-title">Recent Classrooms</h2>
              <div className="classrooms__recent-grid">
                {recentClassrooms.map((classroom) => (
                  <motion.div
                    key={classroom.roomId}
                    className="classrooms__recent-item"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="classrooms__recent-info">
                      <div className="classrooms__recent-name">
                        <Users size={14} />
                        <span>{classroom.name}</span>
                      </div>
                      <div className="classrooms__recent-meta">
                        <Clock size={12} />
                        <span>{formatTimeAgo(classroom.joinedAt)}</span>
                        <span className={`classrooms__recent-role classrooms__recent-role--${classroom.role}`}>
                          {classroom.role}
                        </span>
                      </div>
                    </div>
                    <div className="classrooms__recent-actions">
                      <button
                        className="classrooms__recent-action"
                        onClick={() => copyClassroomId(classroom.roomId)}
                        title="Copy Classroom ID"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className="classrooms__recent-action classrooms__recent-action--rejoin"
                        onClick={() => { void rejoinClassroom(classroom); }}
                        title="Rejoin"
                        disabled={isJoining}
                      >
                        <ArrowRight size={14} />
                      </button>
                      <button
                        className="classrooms__recent-action classrooms__recent-action--remove"
                        onClick={() => handleRemoveRecent(classroom.roomId)}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when idle and no recent */}
        {recentClassrooms.length === 0 && (
          <motion.div
            className="classrooms__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>{isFaculty
              ? 'Create your first classroom and share the code with students'
              : 'Ask your instructor for a classroom code to get started'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Classrooms;
