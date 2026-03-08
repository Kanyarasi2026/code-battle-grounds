import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ParticleField from '../../components/effects/ParticleField';
import { useAuth } from '../../context/AuthContext';
import './Login.scss';

const Signup = () => {
  const { signInWithGoogle, loading } = useAuth();
  const handleGoogleSignIn = async (): Promise<void> => { await signInWithGoogle(); };
  return (
    <div className="login" style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticleField />
      <motion.div aria-hidden="true" style={{ position: 'absolute', top: '-12%', right: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 70%)', filter: 'blur(72px)', pointerEvents: 'none', zIndex: 0 }} animate={{ y: [0, -28, 0], x: [0, 18, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.016) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} animate={{ y: [0, 24, 0], x: [0, -16, 0], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 6 }} />
      <motion.div aria-hidden="true" style={{ position: 'absolute', top: '40%', left: '5%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.012) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
      <motion.div className="login__center" style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
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
      <footer className="login__footer"><p>Built by <a href="https://github.com/Kanyarasi2026/code-battle-grounds" target="_blank" rel="noreferrer">MSG-Kanyarasi</a></p></footer>
    </div>
  );
};

export default Signup;
