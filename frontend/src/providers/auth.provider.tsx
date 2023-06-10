import axios from 'axios';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

const defaultUser = {
  address: '',
};

const AuthContext = createContext({
  user: defaultUser,
  signIn: (user: any) => {},
  signOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState(defaultUser);

  const signIn = setUser;

  const signOut = () => {
    setUser(defaultUser);
    axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/logout`, {
      withCredentials: true,
    });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
