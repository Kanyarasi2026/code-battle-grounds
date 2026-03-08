import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './AuthLayout.scss';

export default function AuthLayout() {
  return (
    <>
      <motion.div
        className="auth-layout__profile"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
      >
        <ProfileIcon />
      </motion.div>
      <Outlet />
    </>
  );
}
