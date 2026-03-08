import { Component, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
// RoleProtectedRoute not used here — import removed to satisfy linter
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoomProvider, useRoom } from './context/RoomContext';
import AlreadyInRoom from './pages/404/AlreadyInRoom';
// Faculty/Student assessment pages are imported where needed; removed unused imports
import AlgorithmChallenges from './pages/challenges/AlgorithmChallenges';
import ChallengeSolve from './pages/challenges/ChallengeSolve';
import EditorPage from './pages/code-editor/EditorPage';
import CuratedPracticePage from './pages/curated-practice/CuratedPracticePage';
import AcademicFeatures from './pages/features-selection/AcademicFeatures';
import FeaturesSelection from './pages/features-selection/FeaturesSelection';
import ProfessionalFeatures from './pages/features-selection/ProfessionalFeatures';
import AssessmentMode from './pages/features/AssessmentMode';
import ClassAnalytics from './pages/features/ClassAnalytics';
import IntegrityTimeline from './pages/features/IntegrityTimeline';
import InterviewDashboard from './pages/features/mock-interview/InterviewDashboard';
import MockInterview from './pages/features/mock-interview/MockInterview';
import AudioInterview from './pages/features/mock-interview/video-interview/AudioInterview';
import PairProgramming from './pages/features/PairProgramming';
import ProgressTracking from './pages/features/ProgressTracking';
import SessionReplay from './pages/features/SessionReplay';
import Home from './pages/home/Home';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';
import RoleSelection from './pages/role-selection/RoleSelection';
import { NavigationStackProvider } from './context/NavigationStackContext';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<
	{ children: ReactNode },
	ErrorBoundaryState
> {
	constructor(props: { children: ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}
	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, info);
	}
	render() {
		if (this.state.hasError)
			return (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh',
						flexDirection: 'column',
						gap: '16px',
						backgroundColor: '#0a0a0b',
						color: '#fafafa',
						fontFamily: 'Inter, -apple-system, sans-serif',
					}}
				>
					<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
						Something went wrong
					</h1>
					<p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
						{this.state.error?.message ?? 'An unexpected error occurred'}
					</p>
					<button
						onClick={() => window.location.reload()}
						style={{
							padding: '8px 16px',
							fontSize: '14px',
							cursor: 'pointer',
							backgroundColor: '#22c55e',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontWeight: 500,
						}}
					>
						Reload Page
					</button>
				</div>
			);
		return this.props.children;
	}
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0a0a0b' }} />;
  return <Navigate to={user ? '/home' : '/login'} replace />;
}

function NavigationGuard({ children }: { children: ReactNode }) {
	const location = useLocation();
	const { user, loading: authLoading } = useAuth();
	const { isInRoom, activeRoomId } = useRoom();
	const path = location.pathname;
	const isOnActiveRoom = path === `/editor/${activeRoomId}`;
	const isOnAlreadyInRoom = path === '/already-in-room';
  const isPublicOnlyPath = path === '/login' || path === '/login1' || path === '/signup' || path === '/landing';
	if (authLoading) return <>{children}</>;
	if (user && isInRoom && activeRoomId && !isOnActiveRoom && !isOnAlreadyInRoom)
		return <Navigate to="/already-in-room" replace />;
	if (user && isPublicOnlyPath)
		return <Navigate to="/role" replace />;
	return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RoomProvider>
          <Toaster position="top-right" toastOptions={{ style: { background: '#141417', color: '#fafafa', border: '1px solid #27272a', fontFamily: 'Inter, -apple-system, sans-serif', fontSize: '14px', borderRadius: '8px' }, success: { iconTheme: { primary: '#22c55e', secondary: '#141417' }, duration: 3000 }, error: { iconTheme: { primary: '#ef4444', secondary: '#141417' }, duration: 4000 } }} />
          <Router>
            <NavigationStackProvider>
              <NavigationGuard>
                <Routes>
                {/* Public routes */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login1" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/already-in-room" element={<AlreadyInRoom />} />

                {/* Protected: role & features */}
                <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
                <Route path="/features" element={<ProtectedRoute><FeaturesSelection /></ProtectedRoute>} />
                <Route path="/features/academic" element={<ProtectedRoute><AcademicFeatures /></ProtectedRoute>} />
                <Route path="/features/professional" element={<ProtectedRoute><ProfessionalFeatures /></ProtectedRoute>} />

                {/* Feature pages */}
                <Route path="/practice" element={<ProtectedRoute><AlgorithmChallenges /></ProtectedRoute>} />
                <Route path="/practice/:slug" element={<ProtectedRoute><ChallengeSolve /></ProtectedRoute>} />
                <Route path="/pair" element={<ProtectedRoute><PairProgramming /></ProtectedRoute>} />
                <Route path="/assess" element={<ProtectedRoute><AssessmentMode /></ProtectedRoute>} />
                <Route path="/replay" element={<ProtectedRoute><SessionReplay /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><ClassAnalytics /></ProtectedRoute>} />
                <Route path="/integrity" element={<ProtectedRoute><IntegrityTimeline /></ProtectedRoute>} />
                <Route path="/interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
                <Route
									path="/video-interview"
									element={
										<ProtectedRoute>
											<AudioInterview />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/interview-dashboard"
									element={
										<ProtectedRoute>
											<InterviewDashboard />
										</ProtectedRoute>
									}
								/>
                <Route path="/progress" element={<ProtectedRoute><ProgressTracking /></ProtectedRoute>} />
                <Route path="/sets" element={<ProtectedRoute><CuratedPracticePage /></ProtectedRoute>} />

                {/* Protected: home & editor */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/editor/:roomId" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </NavigationGuard>
            </NavigationStackProvider>
          </Router>
        </RoomProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
