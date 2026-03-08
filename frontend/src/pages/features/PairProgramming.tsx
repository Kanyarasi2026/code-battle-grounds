import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PairProgramming = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const roomId = crypto.randomUUID();
    const username =
      (user?.user_metadata?.['full_name'] as string | undefined) ??
      user?.email ??
      'User';
    navigate(`/editor/${roomId}`, { replace: true, state: { username } });
  }, [navigate, user]);

  return null;
};

export default PairProgramming;
