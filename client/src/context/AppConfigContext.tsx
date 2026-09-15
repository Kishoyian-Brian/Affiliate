import { createContext, useContext, useMemo, type ReactNode } from 'react'

export interface AppConfig {
  minWithdrawal: number
  withdrawalFeePct: number
  defaultHoldHours: number
  currency: string
  apiBaseUrl: string
  telegramBotUsername: string
}

const defaults: AppConfig = {
  minWithdrawal: 5,
  withdrawalFeePct: 2,
  defaultHoldHours: 48,
  currency: 'USD',
  apiBaseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  telegramBotUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? 'WILLIAM_SMITH_EMPIR_BOT',
}

const AppConfigContext = createContext<AppConfig>(defaults)

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => defaults, [])
  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>
}

export function useAppConfig() {
  return useContext(AppConfigContext)
}
