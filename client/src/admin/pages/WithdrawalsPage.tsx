import { useCallback, useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { WithdrawalTable } from '../components/withdrawals/WithdrawalTable'
import { fetchWithdrawals, updateWithdrawalStatus } from '../lib/api'
import type { AdminWithdrawal } from '../types'

export function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setWithdrawals(await fetchWithdrawals())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleAction(id: string, status: AdminWithdrawal['status']) {
    await updateWithdrawalStatus(id, status)
    await load()
  }

  return (
    <section>
      <PageHeader title="Withdrawals" description="Review and process earner payout requests." />

      {loading ? (
        <div className="admin-loading">Loading withdrawals…</div>
      ) : (
        <WithdrawalTable withdrawals={withdrawals} onAction={(id, status) => void handleAction(id, status)} />
      )}
    </section>
  )
}
