export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDateTime(value?: string) {
  if (!value) return null
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

export function daysLeft(endAt: string) {
  const diff = new Date(endAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function formatMemberCount(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M members`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K members`
  return `${count.toLocaleString()} members`
}

export function formatSlotsRemaining(remaining: number, total: number) {
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0
  return `${remaining.toLocaleString()} of ${total.toLocaleString()} spots left (${pct}%)`
}
