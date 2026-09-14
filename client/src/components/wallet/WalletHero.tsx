import type { WalletSummary } from '../../types'
import { formatMoney } from '../../lib/format'

interface WalletHeroProps {
  summary: WalletSummary
}

export function WalletHero({ summary }: WalletHeroProps) {
  const total = summary.availableBalance + summary.pendingBalance

  return (
    <section className="wallet-hero">
      <p className="wallet-hero-label">Total balance</p>
      <p className="wallet-hero-total">{formatMoney(total, summary.currency)}</p>
      <p className="wallet-hero-sub">
        {formatMoney(summary.availableBalance, summary.currency)} available ·{' '}
        {formatMoney(summary.pendingBalance, summary.currency)} on hold
      </p>

      <div className="wallet-hero-divider" />

      <div className="wallet-hero-stats">
        <div className="wallet-stat">
          <span>Lifetime earned</span>
          <strong>{formatMoney(summary.lifetimeEarned, summary.currency)}</strong>
        </div>
        <div className="wallet-stat">
          <span>Withdrawn</span>
          <strong>{formatMoney(summary.lifetimeWithdrawn, summary.currency)}</strong>
        </div>
      </div>
    </section>
  )
}
