import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { fetchCampaigns, fetchDashboard, fetchWithdrawals } from '../lib/api'
import { formatNumber } from '../lib/format'
import type { AdminCampaign, AdminWithdrawal, DashboardStats } from '../types'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void Promise.all([fetchDashboard(), fetchCampaigns(), fetchWithdrawals()]).then(
      ([dashboard, campaignList, withdrawalList]) => {
        setStats(dashboard)
        setCampaigns(campaignList.filter((c) => c.status === 'active').slice(0, 5))
        setWithdrawals(withdrawalList.filter((w) => w.status === 'pending').slice(0, 5))
        setLoading(false)
      },
    )
  }, [])

  if (loading || !stats) {
    return <div className="admin-loading">Loading dashboard…</div>
  }

  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Overview of campaigns, verifications, and pending payouts."
        action={{ label: 'New campaign', to: '/admin/campaigns/new' }}
      />

      <div className="admin-stat-grid">
        <StatCard label="Active campaigns" value={stats.activeCampaigns} />
        <StatCard label="Verifications today" value={formatNumber(stats.verificationsToday)} />
        <StatCard label="Pending withdrawals" value={stats.pendingWithdrawals} />
        <StatCard label="Rewards on hold" value={formatNumber(stats.pendingHolds)} />
      </div>

      <div className="admin-split">
        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Active campaigns</h2>
            <Link to="/admin/campaigns">View all</Link>
          </header>
          {campaigns.length === 0 ? (
            <p className="admin-muted">No active campaigns.</p>
          ) : (
            <ul className="admin-list">
              {campaigns.map((c) => (
                <li key={c.id}>
                  <Link to={`/admin/campaigns/${c.id}`}>{c.title}</Link>
                  <span>
                    {c.stats.verified} verified · {c.slotsRemaining} spots left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Pending withdrawals</h2>
            <Link to="/admin/withdrawals">View queue</Link>
          </header>
          {withdrawals.length === 0 ? (
            <p className="admin-muted">No pending withdrawals.</p>
          ) : (
            <ul className="admin-list">
              {withdrawals.map((w) => (
                <li key={w.id}>
                  <span>{w.displayName}</span>
                  <span>
                    ${w.amount.toFixed(2)} · {w.method.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  )
}
