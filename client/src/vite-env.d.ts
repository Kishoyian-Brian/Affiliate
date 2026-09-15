/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_TELEGRAM_BOT_URL?: string
  readonly VITE_TELEGRAM_MINI_APP_URL?: string
  readonly VITE_TELEGRAM_CHANNEL_URL?: string
  readonly VITE_AFFILIATE_AITRADE_URL?: string
  readonly VITE_AFFILIATE_MINI_APP_SLUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface TelegramWebAppInitData {
  user?: TelegramWebAppUser
  start_param?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  initData: string
  initDataUnsafe: TelegramWebAppInitData
  platform: string
  openTelegramLink: (url: string) => void
  openLink: (url: string) => void
  showAlert: (message: string) => void
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
    notificationOccurred: (type: 'success' | 'error') => void
  }
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
