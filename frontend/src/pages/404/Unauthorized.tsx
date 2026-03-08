import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { roleData } = useAuth();
  // Use verified role if available, otherwise requested role for display
  const displayRole = roleData.verified ?? roleData.requested;

  const handleGoBack = () => {
    navigate('/features', { replace: true });
  };

  const getRoleMessage = () => {
    if (displayRole === 'faculty') {
      return 'This page is only accessible to students.';
    } else if (displayRole === 'student') {
      return 'This page is only accessible to faculty members.';
    }
    return 'You do not have permission to access this page.';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f1f3f5 100%)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f1f3f5 100%)',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(239, 68, 68, 0.15)',
          }}
        >
          <ShieldAlert size={36} strokeWidth={1.5} style={{ color: '#ef4444' }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            color: '#1a1d23',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}
        >
          Access Restricted
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '1rem',
            color: '#6b7280',
            margin: '0 0 32px',
            lineHeight: '1.6',
          }}
        >
          {getRoleMessage()}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            backgroundColor: '#1a1d23',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowLeft size={16} />
          Back to Features
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'rgba(107, 114, 128, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(107, 114, 128, 0.1)',
          }}
        >
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.5',
          }}>
            {displayRole === 'student' && 'Faculty members can create and manage assessments.'}
            {displayRole === 'faculty' && 'Students can take and submit assessments.'}
            {!displayRole && 'Please select your role to access the appropriate features.'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
