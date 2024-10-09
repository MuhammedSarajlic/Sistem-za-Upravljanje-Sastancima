import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalProvider';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useGlobalContext();

  return isLoggedIn ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
