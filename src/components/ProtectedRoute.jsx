import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  // Not authenticated at all
  if (!user.isAuthenticated) {
    // Redirect to appropriate login page based on required role
    if (requiredRole === 'employer') {
      return <Navigate to="/employer-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    if (user.role === 'employer') {
      return <Navigate to="/employer" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and has correct role (or no role required)
  return children;
}

export default ProtectedRoute;
