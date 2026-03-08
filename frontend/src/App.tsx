import { Component, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoomProvider, useRoom } from './context/RoomContext';
import AlreadyInRoom from './pages/404/AlreadyInRoom';
import EditorPage from './pages/code-editor/EditorPage';
import FeaturesSelection from './pages/features-selection/FeaturesSelection';
import AssessmentMode from './pages/features/AssessmentMode';
import ClassAnalytics from './pages/features/ClassAnalytics';
import IntegrityTimeline from './pages/features/IntegrityTimeline';
import MockInterview from './pages/features/MockInterview';
import PairProgramming from './pages/features/PairProgramming';
import PracticeSets from './pages/features/PracticeSets';
import ProgressTracking from './pages/features/ProgressTracking';
import SessionReplay from './pages/features/SessionReplay';
import SoloPractice from './pages/features/SoloPractice';
import Home from './pages/home/Home';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/login/Login';
import RoleSelection from './pages/role-selection/RoleSelection';

interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('Error caught by boundary:', error, info); }
  render() {
    if (this.state.hasError) return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px', backgroundColor: '#0a0a0b', color: '#fafafa', fontFamily: 'Inter, -apple-system, sans-serif' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{this.state.error?.message ?? 'An unexpected error occurred'}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500 }}>Reload Page</button>
      </div>
    );
    return this.props.children;
  }
}

function NavigationGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isInRoom, activeRoomId } = useRoom();
  const path = location.pathname;
  const isOnActiveRoom = path === `/editor/${activeRoomId}`;
  const isOnAlreadyInRoom = path === '/already-in-room';
  if (authLoading) return <>{children}</>;
  if (user && isInRoom && activeRoomId && !isOnActiveRoom && !isOnAlreadyInRoom) return <Navigate to="/already-in-room" replace />;
  if (user && !isInRoom && path === '/login') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RoomProvider>
          <Toaster position="top-right" toastOptions={{ style: { background: '#141417', color: '#fafafa', border: '1px solid #27272a', fontFamily: 'Inter, -apple-system, sans-serif', fontSize: '14px', borderRadius: '8px' }, success: { iconTheme: { primary: '#22c55e', secondary: '#141417' }, duration: 3000 }, error: { iconTheme: { primary: '#ef4444', secondary: '#141417' }, duration: 4000 } }} />
          <Router>
            <NavigationGuard>
              <Routes>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/already-in-room" element={<AlreadyInRoom />} />
                <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
                <Route path="/features" element={<ProtectedRoute><FeaturesSelection /></ProtectedRoute>} />
                
                {/* Feature Pages */}
                <Route path="/practice" element={<ProtectedRoute><SoloPractice /></ProtectedRoute>} />
                <Route path="/pair" element={<ProtectedRoute><PairProgramming /></ProtectedRoute>} />
                <Route path="/assess" element={<ProtectedRoute><AssessmentMode /></ProtectedRoute>} />
                <Route path="/replay" element={<ProtectedRoute><SessionReplay /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><ClassAnalytics /></ProtectedRoute>} />
                <Route path="/integrity" element={<ProtectedRoute><IntegrityTimeline /></ProtectedRoute>} />
                <Route path="/interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><ProgressTracking /></ProtectedRoute>} />
                <Route path="/sets" element={<ProtectedRoute><PracticeSets /></ProtectedRoute>} />
                
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/editor/:roomId" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </NavigationGuard>
          </Router>
        </RoomProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
