import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';
import ProfileIcon from './ProfileIcon';
import { useNavStack } from '../../context/NavigationStackContext';

export default function AuthLayout() {
	const { goBack } = useNavStack();

	return (
		<>
			<motion.header
				className="auth-layout__header"
				initial={{ opacity: 0, y: -6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
			>
				<button
					className="auth-layout__back-btn"
					onClick={() => goBack()}
					title="Go back"
					aria-label="Go back"
				>
					<ArrowLeft size={15} />
					<span>Back</span>
				</button>
				<span className="auth-layout__wordmark">Code Battlegrounds</span>
				<ProfileIcon />
			</motion.header>
			<div className="auth-layout__content">
				<Outlet />
			</div>
		</>
	);
}
