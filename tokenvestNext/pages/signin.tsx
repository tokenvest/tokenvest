import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";
import { useEffect } from "react";

function SignIn() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  useEffect(() => {
    const handleAuth = async () => {
      const response = await requestChallengeAsync({
        address: address as string,
        chainId: chain!.id,
      });
      const { message } = response!;

      const signature = await signMessageAsync({ message });

      // redirect user after success authentication to '/user' page
      const urlResponse = await signIn("moralis-auth", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/user",
      });
      const { url } = urlResponse!;
      /**
       * instead of using signIn(..., redirect: "/user")
       * we get the url from callback and push it to the router to avoid page refreshing
       */
      push(url!);
    };
    if (status === "unauthenticated" && isConnected) {
      handleAuth();
    }
  }, [status, isConnected]);

  return (
    <div>
      <h3>Web3 Authentication</h3>
      <ConnectButton />
    </div>
  );
}

export default SignIn;
