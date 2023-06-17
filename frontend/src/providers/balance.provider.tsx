import { createContext, useEffect, useState } from "react";
import axios from "axios";

const BalanceContext = createContext({
  balance: 0,
  loading: true,
});

const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const getBalance = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/balance`
    );
    setBalance(response);
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
