import type { WalletSummary } from '../../types/wallet'
import { formatMoney } from '../../lib/format'

export function BalanceCard({ summary }: { summary: WalletSummary }) {
  const total = summary.availableBalance + summary.pendingBalance

  return (
    <section className="wallet-hero">
      <p className="wallet-hero-label">Total balance</p>
      <p className="wallet-hero-total">{formatMoney(total, summary.currency)}</p>
      <p className="wallet-hero-sub">
        {formatMoney(summary.availableBalance, summary.currency)} available ·{' '}
        {formatMoney(summary.pendingBalance, summary.currency)} on hold
      </p>
    </section>
  )
}
