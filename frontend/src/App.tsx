import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createConfig, configureChains, mainnet, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Landing from './pages/Landing';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  // {
  //   path: "/user",
  //   element: <User />,
  // },
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
