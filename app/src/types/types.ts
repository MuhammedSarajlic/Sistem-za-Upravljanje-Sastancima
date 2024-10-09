export type TUser = {
  id: string;
  name: string;
  email: string;
};

export type TGlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: TUser | null;
  setUser: React.Dispatch<React.SetStateAction<TUser | null>>;
};
