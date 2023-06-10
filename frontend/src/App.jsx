import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing";
import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createConfig({
  provider,
  webSocketProvider,
  autoConnect: true,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);

function App() {
  return (
    <>
      <WagmiConfig client={client}>
        <RouterProvider router={router} />
      </WagmiConfig>
    </>
  );
}

export default App;
