/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JWT_SECRET: string;
  readonly VITE_MORALIS_API_KEY: string;
  readonly VITE_MORALIS_HOST: string;
  readonly VITE_MORALIS_REACT_URL: string;
  readonly VITE_MORALIS_AUTH_SECRET: string;
  readonly VITE_MONGODB_URL: string;
  readonly VITE_MONGODB_DATABASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
