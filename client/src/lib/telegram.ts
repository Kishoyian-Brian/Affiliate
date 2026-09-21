import WebApp from '@twa-dev/sdk'

export const TELEGRAM_BOT_USERNAME =
  import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? 'tasklane_bot'

export const TELEGRAM_MINI_APP_URL =
  import.meta.env.VITE_TELEGRAM_MINI_APP_URL ?? 'https://client-psi-six-83.vercel.app'

export const TELEGRAM_CHANNEL_URL =
  import.meta.env.VITE_TELEGRAM_CHANNEL_URL ?? 'https://t.me/TasklaneSupport'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

function getWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? WebApp ?? null
}

function initDataFromHash() {
  if (typeof window === 'undefined') return ''
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  return new URLSearchParams(hash).get('tgWebAppData') ?? ''
}

export function getInitData(): string {
  const app = getWebApp()
  return app?.initData || initDataFromHash()
}

function parseUserFromInitData(initData: string): TelegramUser | undefined {
  if (!initData) return undefined
  try {
    const raw = new URLSearchParams(initData).get('user')
    if (!raw) return undefined
    return JSON.parse(raw) as TelegramUser
  } catch {
    return undefined
  }
}

export function isInsideTelegram() {
  const app = getWebApp()
  if (getInitData()) return true
  if (app?.initDataUnsafe?.user?.id) return true
  return false
}

export function isTelegramWebApp() {
  return isInsideTelegram()
}

export function getTelegramBotUrl() {
  const fromEnv = import.meta.env.VITE_TELEGRAM_BOT_URL?.replace(/\/+$/, '')
  if (fromEnv?.startsWith('https://t.me/')) return fromEnv
  return `https://t.me/${TELEGRAM_BOT_USERNAME.replace(/^@/, '')}`
}

/** Website CTAs open the Telegram bot chat, not the hosted Mini App URL. */
export function getTelegramBotLaunchUrl(startParam?: string) {
  const base = getTelegramBotUrl()
  if (startParam) {
    return `${base}?startapp=${encodeURIComponent(startParam)}`
  }
  return base
}

/** Hosted Mini App URL from env. Used by the bot Open Tasklane button, not landing CTAs. */
export function getTelegramMiniAppUrl(startParam?: string) {
  return getTelegramBotLaunchUrl(startParam)
}

export function initTelegramApp() {
  const app = getWebApp()
  if (!app?.ready) return

  app.ready()
  app.expand()
  app.setHeaderColor('#ffffff')
  app.setBackgroundColor('#fafafa')
}

export function getTelegramUser(): TelegramUser | undefined {
  const app = getWebApp()
  const fromUnsafe = app?.initDataUnsafe?.user
  if (fromUnsafe?.id) {
    return {
      id: fromUnsafe.id,
      first_name: fromUnsafe.first_name,
      last_name: fromUnsafe.last_name,
      username: fromUnsafe.username,
      language_code: fromUnsafe.language_code,
    }
  }
  return parseUserFromInitData(getInitData())
}

export function getStartParam(): string | undefined {
  const app = getWebApp()
  return app?.initDataUnsafe?.start_param || undefined
}

export function parseStartParam(param?: string) {
  if (!param) return null

  // Campaign ids are cuids; referrer is Telegram numeric id.
  const match = param.match(/^task([A-Za-z0-9]+)(?:_ref(\d+))?$/)
  if (!match) return null

  return {
    taskId: match[1],
    referrerId: match[2],
  }
}

export function openTelegramChannel(username: string) {
  openTelegramUrl(`https://t.me/${username}`)
}

/** Opens a t.me Mini App or chat link inside Telegram (Launch), never the system browser. */
export function openTelegramUrl(url: string) {
  const app = getWebApp()

  if (isInsideTelegram() && app?.openTelegramLink) {
    app.openTelegramLink(url)
    return
  }

  window.location.assign(url)
}

export function shareReferralLink(url: string, text: string) {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  const app = getWebApp()

  if (isInsideTelegram() && app?.openTelegramLink) {
    app.openTelegramLink(shareUrl)
    return
  }

  window.open(shareUrl, '_blank', 'noopener,noreferrer')
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    return false
  }

  return false
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error') {
  const app = getWebApp()
  if (!isInsideTelegram() || !app?.HapticFeedback) return

  if (type === 'success' || type === 'error') {
    app.HapticFeedback.notificationOccurred(type)
    return
  }

  app.HapticFeedback.impactOccurred(type)
}
