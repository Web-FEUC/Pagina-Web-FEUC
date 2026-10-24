/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMPLEOS_ADMIN_PASSWORD?: string
  readonly VITE_EMPLEOS_TELEGRAM_URL?: string
  readonly VITE_EMPLEOS_WHATSAPP_URL?: string
  readonly VITE_EMPLEOS_API_BASE?: string
  readonly VITE_EMPLEOS_LOCAL_FALLBACK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
