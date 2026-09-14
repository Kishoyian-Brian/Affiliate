import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PendingRewards } from '../components/wallet/PendingRewards'
import { RewardHistory } from '../components/wallet/RewardHistory'
import { WalletHero } from '../components/wallet/WalletHero'
import { WithdrawPanel } from '../components/wallet/WithdrawPanel'
import { WithdrawalHistory } from '../components/wallet/WithdrawalHistory'
import { useWallet } from '../hooks/useWallet'

export function WalletPage() {
  const { wallet, loading, error, withdrawing, reload, withdraw } = useWallet()

  useEffect(() => {
    document.title = 'Tasklane — Wallet'
  }, [])

  if (loading) {
    return <div className="state-block">Loading wallet…</div>
  }

  if (error || !wallet) {
    return (
      <section className="page">
        <div className="state-block state-error">
          <p>{error ?? 'Wallet unavailable'}</p>
          <button type="button" className="btn btn-secondary" onClick={() => void reload()}>
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="page wallet-page">
      <header className="page-header">
        <h1>Wallet</h1>
        <p>Available balance, pending holds, and withdrawal history.</p>
      </header>

      <WalletHero summary={wallet.summary} />

      <PendingRewards rewards={wallet.rewards} />

      <WithdrawPanel summary={wallet.summary} withdrawing={withdrawing} onWithdraw={withdraw} />

      <RewardHistory rewards={wallet.rewards} />

      <WithdrawalHistory withdrawals={wallet.withdrawals} />

      <p className="page-footnote">
        Rewards move to available balance after the hold period if you remain subscribed.{' '}
        <Link to="/app/profile">Verification policy</Link>
      </p>
    </section>
  )
}
