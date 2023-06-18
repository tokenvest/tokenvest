import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const BalanceContext = createContext({
  balance: {
    balance: 0,
  },
  loading: true,
  write: () => {},
});

const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState({});
  const [loading, setLoading] = useState(true);

  const getBalance = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/balance`,
      {
        withCredentials: true,
      }
    );
    setBalance(response.data);
    setLoading(false);
  };
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, loading }}>
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceProvider;
