import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface RoleProtectedRouteProps {
  children?: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

// Demo mode flag - set to false in production for strict security
const ALLOW_UNVERIFIED_DEMO_MODE = true;

const RoleProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = '/unauthorized'
}: RoleProtectedRouteProps) => {
  const { user, roleData, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#242424' 
      }}>
        <div className="spinner" />
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if this is an assessment-related route (academic-only context)
  const isAcademicRoute = location.pathname.includes('/assessment') || 
                          location.pathname.includes('/assess');

  // Redirect to role selection if user hasn't requested a role yet
  if (!roleData.requested && !roleData.verified) {
    // For assessment routes, use academic-only role selection
    if (isAcademicRoute) {
      return <Navigate 
        to="/role" 
        state={{ 
          academicOnly: true, 
          returnTo: location.pathname 
        }} 
        replace 
      />;
    }
    return <Navigate to="/role" replace />;
  }

  // PRIMARY SECURITY CHECK: Use verified role for authorization
  const authoritativeRole = roleData.verified;
  
  // If role is verified, enforce it strictly
  if (authoritativeRole) {
    if (!allowedRoles.includes(authoritativeRole)) {
      return <Navigate to={redirectTo} replace />;
    }
    // Verified role matches - allow access
    return children ?? <Outlet />;
  }

  // FALLBACK: No verified role available
  // In production, this should BLOCK access
  // In demo mode, we allow with requested role (INSECURE)
  if (ALLOW_UNVERIFIED_DEMO_MODE && roleData.requested) {
    // Security warning: Using unverified role for demo purposes only
    console.warn(
      `[SECURITY] Using unverified role "${roleData.requested}" for route protection. ` +
      `This is INSECURE and should only be used in development/demo. ` +
      `Backend role verification is required for production.`
    );

    if (!allowedRoles.includes(roleData.requested)) {
      return <Navigate to={redirectTo} replace />;
    }

    // Allow access with unverified role (DEMO MODE ONLY)
    return (
      <>
        {/* Development warning banner */}
        {import.meta.env.DEV && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ff6b35',
            color: 'white',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: '13px',
            zIndex: 9999,
            fontFamily: 'monospace',
          }}>
            ⚠️ DEMO PROTOTYPE: Role selection for navigation only — not a security feature
          </div>
        )}
        {children ?? <Outlet />}
      </>
    );
  }

  // Production mode or no requested role: DENY ACCESS
  // Redirect to role selection with appropriate context
  if (isAcademicRoute) {
    return <Navigate 
      to="/role" 
      state={{ 
        academicOnly: true, 
        returnTo: location.pathname 
      }} 
      replace 
    />;
  }
  return <Navigate to="/role?status=pending" replace />;
};

export default RoleProtectedRoute;
