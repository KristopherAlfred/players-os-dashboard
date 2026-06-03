/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DAME_BIO_API_URL?: string;
  readonly VITE_ADMIN_EXPORT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
