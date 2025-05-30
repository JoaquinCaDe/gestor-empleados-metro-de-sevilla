
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  // Render the protected component
  return children;
};

export default PrivateRoute;
