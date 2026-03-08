import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Copy, Sparkles } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import './Home.scss';

interface LocationState {
	toastMessage?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState((user?.user_metadata?.['full_name'] as string | undefined) ?? user?.email ?? '');
  const [isJoining, setIsJoining] = useState(false);

	useEffect(() => {
		const state = location.state as LocationState | null;
		if (state?.toastMessage) toast.error(state.toastMessage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isValidUUID = (id: string) =>
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

	const generateRoomId = () => {
		const id = v4();
		setRoomId(id);
		navigator.clipboard
			.writeText(id)
			.then(() => toast.success('Room ID copied to clipboard'))
			.catch(() => {});
	};

	const createRoom = (e: FormEvent) => {
		e.preventDefault();
		if (!username || username.trim().length < 2) {
			toast.error('Please enter your name (at least 2 characters)');
			return;
		}
		const id = v4();
		const u = username.trim();
		navigator.clipboard
			.writeText(id)
			.then(() => toast.success('Room ID created & copied'))
			.catch(() => {});
		navigate(`/editor/${id}`, { state: { username: u } });
	};

	const joinRoom = async (): Promise<void> => {
		if (!roomId || !username) {
			toast.error('Room ID & username are required');
			return;
		}
		const r = roomId.trim();
		const u = username.trim();
		if (!isValidUUID(r)) {
			toast.error('Invalid Room ID format');
			return;
		}
		if (u.length < 2) {
			toast.error('Username must be at least 2 characters');
			return;
		}
		if (u.length > 30) {
			toast.error('Username cannot exceed 30 characters');
			return;
		}
		if (!/^[a-zA-Z0-9_\s]+$/.test(u)) {
			toast.error(
				'Username can only contain letters, numbers, spaces, and underscores',
			);
			return;
		}
		if (isJoining) return;
		setIsJoining(true);
		try {
			const BACKEND_URL =
				import.meta.env['VITE_SOCKET_URL'] ?? 'http://localhost:3000';
			const res = await fetch(`${BACKEND_URL}/room/${r}/exists`);
			if (!res.ok) throw new Error('Failed to validate room');
			const data = (await res.json()) as { exists: boolean };
			if (!data.exists) {
				toast.error('Room does not exist. Check the ID or create a new room.');
				setIsJoining(false);
				return;
			}
			navigate(`/editor/${r}`, { state: { username: u } });
		} catch {
			toast.error('Failed to validate room. Please try again.');
			setIsJoining(false);
		}
	};

	const handleInputEnter = (e: KeyboardEvent) => {
		if (e.code === 'Enter') void joinRoom();
	};

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__header-left">
          <button className="home__back-btn" onClick={() => navigate('/role')}>
            <ArrowLeft size={16} />
            Explore Features
          </button>
        </div>
      </header>
      <motion.main className="home__main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
        <div className="home__brand">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Code<span>Battlegrounds</span></motion.h1>
          <p className="home__tagline">Real-time collaborative code editor</p>
        </div>
        <Card className="home__card">
          <div className="home__form">
            <Input label="Your Name" placeholder="Enter your name" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} onKeyUp={handleInputEnter} disabled={isJoining} />
            <Input label="Room ID" placeholder="Paste a room ID to join" value={roomId} onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} disabled={isJoining}
              suffix={<button className="home__generate-btn" onClick={generateRoomId} type="button" title="Generate Room ID"><Sparkles size={14} />Generate</button>} />
            {roomId && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Button variant="primary" className="home__join-btn" onClick={() => { void joinRoom(); }} loading={isJoining} iconRight={<ArrowRight size={16} />}>Join Room</Button>
              </motion.div>
            )}
            <div className="home__divider"><span>or</span></div>
            <Button variant="secondary" className="home__create-btn" onClick={createRoom} iconLeft={<Copy size={14} />}>Create New Room</Button>
          </div>
        </Card>
      </motion.main>
      <footer className="home__footer"><p>Built by <a href="https://github.com/Kanyarasi2026/code-battle-grounds" target="_blank" rel="noreferrer">MSG-Kanyarasi</a></p></footer>
    </div>
  );
};
export default Home;
