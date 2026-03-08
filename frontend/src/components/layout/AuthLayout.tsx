import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import './AuthLayout.scss';
import ProfileIcon from './ProfileIcon';

export default function AuthLayout() {
	const navigate = useNavigate();

	return (
		<>
			<motion.div
				className="auth-layout__home"
				initial={{ opacity: 0, y: -6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
			>
				<button
					className="auth-layout__home-btn"
					onClick={() => navigate('/role')}
					title="Home"
					aria-label="Go to home"
				>
					<ArrowLeft size={16} />
					<span>Home</span>
				</button>
			</motion.div>
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
