import { createContext, useEffect, useState, ReactNode } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

type BalanceProviderProps = {
  children: ReactNode;
};

type BalanceProps = {
  tUSDBalance: {
    balance: number;
  };
  nativeBalance: {
    balance: number;
  };
  tokenVestNFT: [
    {
      tokenAddress: string;
      tokenId: string;
      metadata: {
        name: string;
        description: string;
        image: string;
      };
    }
  ];
};

export const BalanceContext = createContext({
  balance: {
    tUSDBalance: {
      balance: 0,
    },
    nativeBalance: {
      balance: 0,
    },
    tokenVestNFT: [
      {
        tokenAddress: "",
        tokenId: "",
        metadata: {
          name: "",
          description: "",
          image: "",
        },
      },
    ],
  },
  loading: true,
});

const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const [balance, setBalance] = useState<BalanceProps>({
    tUSDBalance: {
      balance: 0,
    },
    nativeBalance: {
      balance: 0,
    },
    nfts: [],
  });
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
    console.log("balance balanceprovider", balance);
    setBalance(balance);
    setLoading(false);
  };

  useEffect(() => {
    getBalance();
  }, [balance]);

  return (
    <BalanceContext.Provider value={{ balance, loading }}>
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceProvider;
