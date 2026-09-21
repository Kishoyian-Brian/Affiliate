import { TonConnectUIProvider } from '@tonconnect/ui-react'
import type { ReactNode } from 'react'
import { TELEGRAM_BOT_USERNAME, TELEGRAM_MINI_APP_URL } from '../lib/telegram'

function resolveManifestUrl() {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/tonconnect-manifest.json`
  }
  return `${TELEGRAM_MINI_APP_URL.replace(/\/+$/, '')}/tonconnect-manifest.json`
}

function resolveReturnUrl(): `${string}://${string}` {
  return `https://t.me/${TELEGRAM_BOT_USERNAME.replace(/^@/, '')}`
}

export function TonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl={resolveManifestUrl()}
      actionsConfiguration={{
        twaReturnUrl: resolveReturnUrl(),
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}
