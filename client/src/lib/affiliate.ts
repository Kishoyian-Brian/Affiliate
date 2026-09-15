const DEFAULT_AITRADE_URL = 'https://aiautotrade.trade'
const DEFAULT_AFFILIATE_MINI_APP_SLUG = 'aiautotrade'

export function normalizeAffiliateUrl(value?: string) {
  const raw =
    value?.trim() ||
    import.meta.env.VITE_AFFILIATE_AITRADE_URL?.trim() ||
    DEFAULT_AITRADE_URL
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

export function getAffiliateHostname(value?: string) {
  try {
    return new URL(normalizeAffiliateUrl(value)).hostname.replace(/^www\./, '')
  } catch {
    return 'aiautotrade.trade'
  }
}

export function getAffiliateMiniAppSlug() {
  return (import.meta.env.VITE_AFFILIATE_MINI_APP_SLUG ?? DEFAULT_AFFILIATE_MINI_APP_SLUG)
    .replace(/^\/+|\/+$/g, '')
}

export function buildAffiliateStartParam(telegramId: number | string) {
  return `ref${telegramId}`
}

/** Telegram Mini App deep link only — never the trading-site HTTPS URL. */
export function buildAffiliateMiniAppLink(botUsername: string, telegramId: number | string) {
  const bot = botUsername.replace(/^@/, '')
  const slug = getAffiliateMiniAppSlug()
  const startParam = encodeURIComponent(buildAffiliateStartParam(telegramId))
  return `https://t.me/${bot}/${slug}?startapp=${startParam}`
}

export function getCampaignTargetLabel(item: {
  type: string
  affiliateUrl?: string
  channelUsername: string
  channelTitle?: string
}) {
  if (item.type === 'affiliate') {
    return item.channelTitle || 'AI AutoTrade'
  }
  return `@${item.channelUsername}`
}
