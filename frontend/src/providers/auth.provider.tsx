import axios from 'axios';
import { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';

const defaultUser = {
  address: '',
};

const AuthContext = createContext({
  isAuthorized: false,
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/authenticate`, {
        // TODO: hacky bug fix
        withCredentials: !!document.cookie,
      })
      .then(({ data }) => {
        signIn(data);
      })
      .catch(() => signOut());
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthorized: !!user?.address, user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
