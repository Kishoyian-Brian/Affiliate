import { useCallback, useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { AdminTable } from '../components/ui/AdminTable'
import { fetchWithdrawals, updateWithdrawalStatus } from '../lib/api'
import { formatDateTime, formatMoney } from '../lib/format'
import type { AdminWithdrawal } from '../types'

export function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setWithdrawals(await fetchWithdrawals())
    setLoading(false)
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
      <PageHeader
        title="Withdrawals"
        description="Review and process earner payout requests."
      />

      {loading ? (
        <div className="admin-loading">Loading withdrawals…</div>
      ) : (
        <AdminTable label="Withdrawals table" minWidth={1100} scrollable>
          <thead>
            <tr>
              <th scope="col" className="col-primary">
                User
              </th>
              <th scope="col" className="col-num">
                Amount
              </th>
              <th scope="col">Method</th>
              <th scope="col" className="col-wide">
                Destination
              </th>
              <th scope="col">Status</th>
              <th scope="col">Requested</th>
              <th scope="col" className="col-actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id}>
                <td className="col-primary">
                  <strong>{w.displayName}</strong>
                </td>
                <td className="col-num">{formatMoney(w.amount, w.currency)}</td>
                <td className="admin-uppercase">{w.method.replace('_', ' ')}</td>
                <td className="col-wide admin-mono">{w.destination}</td>
                <td>
                  <span className={`admin-badge admin-badge-withdrawal-${w.status}`}>
                    {w.status}
                  </span>
                </td>
                <td>{formatDateTime(w.requestedAt)}</td>
                <td className="col-actions">
                  {w.status === 'pending' ? (
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn-text"
                        onClick={() => void handleAction(w.id, 'processing')}
                      >
                        Process
                      </button>
                      <button
                        type="button"
                        className="admin-btn-text danger"
                        onClick={() => void handleAction(w.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                  {w.status === 'processing' ? (
                    <button
                      type="button"
                      className="admin-btn-text"
                      onClick={() => void handleAction(w.id, 'completed')}
                    >
                      Mark paid
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </section>
  )
}
