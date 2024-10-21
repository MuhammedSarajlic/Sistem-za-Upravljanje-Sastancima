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

export type TMeeting = {
  description: string;
  endTime: string;
  id: string;
  participants: [
    {
      email: string;
      hashedPassword: string;
      id: string;
      name: string;
    }
  ];
  participantsIds: [];
  startTime: string;
  title: string;
};

export type TNewEvent = {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  participantsIds?: [string];
  participants?: [
    {
      id: string;
    }
  ];
};
