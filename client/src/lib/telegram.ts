import WebApp from '@twa-dev/sdk'

function getWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? WebApp ?? null
}

export function isTelegramWebApp() {
  return Boolean(getWebApp())
}

export function initTelegramApp() {
  const app = getWebApp()
  if (!app?.ready) return

  app.ready()
  app.expand()
  app.setHeaderColor('#ffffff')
  app.setBackgroundColor('#fafafa')
}

export function getTelegramUser() {
  return getWebApp()?.initDataUnsafe?.user
}

export function getStartParam(): string | undefined {
  return getWebApp()?.initDataUnsafe?.start_param
}

export function parseStartParam(param?: string) {
  if (!param) return null

  const match = param.match(/^task(\d+)(?:_ref(\d+))?$/)
  if (!match) return null

  return {
    taskId: match[1],
    referrerId: match[2],
  }
}

export function openTelegramChannel(username: string) {
  const url = `https://t.me/${username}`
  const app = getWebApp()

  if (app?.openTelegramLink) {
    app.openTelegramLink(url)
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

export function shareReferralLink(url: string, text: string) {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  const app = getWebApp()

  if (app?.openTelegramLink) {
    app.openTelegramLink(shareUrl)
    return
  }

  window.open(shareUrl, '_blank', 'noopener,noreferrer')
}

export function copyToClipboard(text: string) {
  const app = getWebApp()

  if (app?.platform !== 'unknown' && navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }

  if (app?.showAlert) {
    app.showAlert('Copy this link:\n\n' + text)
    return Promise.resolve()
  }

  return navigator.clipboard?.writeText(text) ?? Promise.resolve()
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error') {
  const app = getWebApp()
  if (!app?.HapticFeedback) return

  if (type === 'success' || type === 'error') {
    app.HapticFeedback.notificationOccurred(type)
    return
  }

  app.HapticFeedback.impactOccurred(type)
}

export function getInitData(): string {
  return getWebApp()?.initData ?? ''
}
