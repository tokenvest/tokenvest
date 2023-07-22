import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tokenvest</title>
        <meta
          content="Tokenized real estate investments on the blockchain"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <ConnectButton />
        <Navbar />

        <h1 className="text-5xl text-red-600">this is a test</h1>
      </main>

      <footer>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
