import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createConfig, configureChains, WagmiConfig, sepolia } from "wagmi";

import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import Register from "./pages/Register";
import { AuthProvider } from "./providers/auth.provider";
import BalanceProvider from "./providers/balance.provider";
import { alchemyProvider } from "wagmi/providers/alchemy";

const { publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: import.meta.env.VITE_APP_ALCHEMI_KEY })]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
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
]);

function App() {
  return (
    <BalanceProvider>
      <WagmiConfig config={config}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </WagmiConfig>
    </BalanceProvider>
  );
}

export default App;
