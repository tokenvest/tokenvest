import { createConfig, configureChains, WagmiConfig, sepolia } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./providers/auth.provider";
import BalanceProvider from "./providers/balance.provider";
const projectId = import.meta.env.VITE_APP_WALLET_CONNECT_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_APP_ALCHEMI_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: projectId,
  chains,
});

const config = createConfig({
  publicClient,
  webSocketPublicClient,
  connectors,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/Marketplace",
    element: <Marketplace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <AuthProvider>
          <BalanceProvider>
            <RouterProvider router={router} />
          </BalanceProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
