import { createContext, useEffect, useState, ReactNode } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

type BalanceProviderProps = {
  children: ReactNode;
};

export const BalanceContext = createContext({
  balance: {
    tUSDBalance: {
      balance: 0,
    },
    nativeBalance: {
      balance: 0,
    },
  },
  loading: true,
});

const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const [balance, setBalance] = useState({ tUSDBalance: 0, nativeBalance: 0 });
  const [loading, setLoading] = useState(true);
  const { isConnected } = useAccount();

  const getBalance = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/balance`,
      {
        withCredentials: true,
      }
    );
    const balance = response.data;
    setBalance(balance);
    setLoading(false);
  };
  useEffect(() => {
    getBalance();
  }, [isConnected, balance]);

  return (
    <BalanceContext.Provider value={{ balance, loading }}>
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceProvider;
