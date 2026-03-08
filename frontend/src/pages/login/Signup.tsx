import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import './Login.scss';

const Signup = () => {
  const { signInWithGoogle, loading } = useAuth();
  const handleGoogleSignIn = async (): Promise<void> => { await signInWithGoogle(); };
  return (
    <div className="login">
      <motion.div className="login__center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="login__brand">
          <div className="login__icon"><Code2 size={32} strokeWidth={1.5} /></div>
          <h1>Code<span>Battlegrounds</span></h1>
          <p>Real-time collaborative code editor</p>
        </div>
        <Card className="login__card">
          <div className="login__card-body">
            <h2>Create your account</h2>
            <p className="login__description">Sign up with your Google account to get started with collaborative coding.</p>
            <Button variant="secondary" className="login__google-btn" onClick={() => { void handleGoogleSignIn(); }} loading={loading}
              iconLeft={<img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" width={18} height={18} />}>
              {loading ? 'Creating account…' : 'Sign up with Google'}
            </Button>
            <p className="login__secure">Secure authentication powered by Supabase</p>
            <p className="login__switch">Already have an account? <Link to="/login1" className="login__switch-link">Sign in</Link></p>
          </div>
        </Card>
      </motion.div>
      <footer className="login__footer"><p>Built by <a href="https://github.com/Kanyarasi2026/code-battle-grounds" target="_blank" rel="noreferrer">MSG-Kanyarashi</a></p></footer>
    </div>
  );
};

export default Signup;
