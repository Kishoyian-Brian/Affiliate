import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BalanceCard } from '../components/wallet/BalanceCard'
import { ConnectWalletCard } from '../components/wallet/ConnectWalletCard'
import { EarningsSummary } from '../components/wallet/EarningsSummary'
import { TransactionList } from '../components/wallet/TransactionList'
import { WithdrawalForm } from '../components/wallet/WithdrawalForm'
import { useAuth } from '../hooks/useAuth'
import { useWallet } from '../hooks/useWallet'

export function WalletPage() {
  const { hasServerSession, authError } = useAuth()
  const {
    wallet,
    loading,
    error,
    withdrawing,
    connecting,
    reload,
    withdraw,
    bindTonWallet,
    unbindTonWallet,
  } = useWallet()

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
          {authError ? <p className="helper-text">{authError}</p> : null}
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
        <p>Available balance, connected TON wallet, and withdrawals.</p>
      </header>

      {!hasServerSession ? (
        <div className="status-callout danger">
          <strong>Account not verified</strong>
          <p>{authError ?? 'Open Tasklane from Telegram so rewards and withdrawals can sync.'}</p>
        </div>
      ) : null}

      <BalanceCard summary={wallet.summary} />
      <ConnectWalletCard
        connected={wallet.connectedWallet}
        connecting={connecting}
        onBound={bindTonWallet}
        onUnbind={unbindTonWallet}
      />
      <EarningsSummary summary={wallet.summary} rewards={wallet.rewards} />
      <WithdrawalForm
        summary={wallet.summary}
        connectedTonAddress={wallet.connectedWallet?.address ?? null}
        withdrawing={withdrawing}
        onWithdraw={withdraw}
      />
      <TransactionList rewards={wallet.rewards} withdrawals={wallet.withdrawals} />

      <p className="page-footnote">
        Rewards move to available balance after the hold period if you remain subscribed.{' '}
        <Link to="/app/profile">Verification policy</Link>
      </p>
    </section>
  )
}
