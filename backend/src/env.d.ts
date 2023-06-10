/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONGODB_URL: string;
  readonly VITE_MONGODB_DATABASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
