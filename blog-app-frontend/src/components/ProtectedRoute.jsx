import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const checkAuth = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    return token ? true : false;
  };

  if (!isAuthenticated || !checkAuth()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
