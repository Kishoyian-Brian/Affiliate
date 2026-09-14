export function formatTimeRemaining(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now()

  if (diff <= 0) return 'Releasing soon'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return `${days}d ${remHours}h left`
  }

  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}
