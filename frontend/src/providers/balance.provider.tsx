import { createContext, useEffect, useState } from "react";
import axios from "axios";

const BalanceContext = createContext({
  balance: "",
  loading: true,
});

const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);

  const getBalance = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/balance`
    );
    console.log(response.data);
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
