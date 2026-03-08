import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../context/RoomContext';

const AlreadyInRoom = () => {
  const { activeRoomId, activeUsername } = useRoom();
  const navigate = useNavigate();
  const handleReturn = () => { if (activeRoomId) navigate(`/editor/${activeRoomId}`, { state: { username: activeUsername } }); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px', backgroundColor: '#0a0a0b', color: '#fafafa', fontFamily: 'Inter, -apple-system, sans-serif', textAlign: 'center', padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>You are already in a room</h1>
      <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: 0 }}>Leave your current room before joining or navigating elsewhere.</p>
      {activeRoomId && <button onClick={handleReturn} style={{ marginTop: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500 }}>Return to my room</button>}
    </div>
  );
};
export default AlreadyInRoom;
