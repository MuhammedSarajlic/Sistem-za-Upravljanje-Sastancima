import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getCurrentUser } from '../services/user';
import { TGlobalContextType, TUser } from '../types/types';

const GlobalContext = createContext<TGlobalContextType | null>(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null | any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const userId: string | null = localStorage.getItem('userId');

  useEffect(() => {
    if (userId != null) {
      getCurrentUser(userId)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setUser(res);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
