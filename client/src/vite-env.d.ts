/// <reference types="vite/client" />

interface TelegramWebAppUser {
  id: number
  first_name: string
  username?: string
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
