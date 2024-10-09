import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalProvider';
import { ReactNode } from 'react';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useGlobalContext();

  return !isLoggedIn ? children : <Navigate to='/' />;
};

export default PublicRoute;
