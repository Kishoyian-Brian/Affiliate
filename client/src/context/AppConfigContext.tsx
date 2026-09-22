import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { normalizeApiBase } from '../lib/api'

export interface AppConfig {
  minWithdrawal: number
  withdrawalFeePct: number
  defaultHoldHours: number
  currency: string
  apiBaseUrl: string
  telegramBotUsername: string
  telegramMiniAppUrl: string
  telegramChannelUrl: string
}

const defaults: AppConfig = {
  minWithdrawal: 5,
  withdrawalFeePct: 2,
  defaultHoldHours: 48,
  currency: 'USD',
  apiBaseUrl: normalizeApiBase(import.meta.env.VITE_API_URL),
  telegramBotUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? 'tasklane_bot',
  telegramMiniAppUrl:
    import.meta.env.VITE_TELEGRAM_MINI_APP_URL ?? 'https://client-psi-six-83.vercel.app',
  telegramChannelUrl: import.meta.env.VITE_TELEGRAM_CHANNEL_URL ?? 'https://t.me/TasklaneSupport',
}

const AppConfigContext = createContext<AppConfig>(defaults)

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => defaults, [])
  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>
}

export function useAppConfig() {
  return useContext(AppConfigContext)
}
