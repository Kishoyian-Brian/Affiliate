import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BalanceCard } from '../components/wallet/BalanceCard'
import { EarningsSummary } from '../components/wallet/EarningsSummary'
import { TransactionList } from '../components/wallet/TransactionList'
import { WithdrawalForm } from '../components/wallet/WithdrawalForm'
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

      <BalanceCard summary={wallet.summary} />
      <EarningsSummary summary={wallet.summary} rewards={wallet.rewards} />
      <WithdrawalForm summary={wallet.summary} withdrawing={withdrawing} onWithdraw={withdraw} />
      <TransactionList rewards={wallet.rewards} withdrawals={wallet.withdrawals} />

      <p className="page-footnote">
        Rewards move to available balance after the hold period if you remain subscribed.{' '}
        <Link to="/app/profile">Verification policy</Link>
      </p>
    </section>
  )
}
