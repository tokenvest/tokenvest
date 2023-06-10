import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createConfig, configureChains, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import Register from "./pages/Register";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
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
    <>
      <WagmiConfig config={config}>
        <RouterProvider router={router} />
      </WagmiConfig>
    </>
  );
}

export default App;
