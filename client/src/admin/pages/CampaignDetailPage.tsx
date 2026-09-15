import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CampaignStatusBadge } from '../components/campaigns/CampaignStatusBadge'
import { AdminTable } from '../components/ui/AdminTable'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import {
  fetchCampaign,
  fetchCampaignCompletions,
  setCampaignStatus,
} from '../lib/api'
import { formatDate, formatDateTime, formatMoney, formatNumber } from '../lib/format'
import type { AdminCampaign, CampaignCompletion } from '../types'

export function CampaignDetailPage() {
  const { id = '' } = useParams()
  const [campaign, setCampaign] = useState<AdminCampaign | null>(null)
  const [completions, setCompletions] = useState<CampaignCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void Promise.all([fetchCampaign(id), fetchCampaignCompletions(id)]).then(
      ([campaignData, completionData]) => {
        setCampaign(campaignData ?? null)
        setCompletions(completionData)
        setLoading(false)
      },
    )
  }, [id])

  async function handleStatus(status: AdminCampaign['status']) {
    if (!campaign) return
    await setCampaignStatus(campaign.id, status)
    setCampaign({ ...campaign, status })
  }

  if (loading) return <div className="admin-loading">Loading…</div>
  if (!campaign) return <div className="admin-empty">Campaign not found.</div>

  return (
    <section>
      <PageHeader title={campaign.title} description={`@${campaign.channelUsername}`} />

      <div className="admin-detail-actions">
        <CampaignStatusBadge status={campaign.status} />
        <Link to={`/admin/campaigns/${id}/edit`} className="admin-btn admin-btn-secondary">
          Edit
        </Link>
        {campaign.status === 'active' ? (
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => void handleStatus('paused')}
          >
            Pause
          </button>
        ) : null}
        {campaign.status === 'paused' ? (
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => void handleStatus('active')}
          >
            Resume
          </button>
        ) : null}
        {campaign.status === 'draft' ? (
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => void handleStatus('active')}
          >
            Publish
          </button>
        ) : null}
      </div>

      <div className="admin-stat-grid">
        <StatCard label="Started" value={formatNumber(campaign.stats.started)} />
        <StatCard label="Verified" value={formatNumber(campaign.stats.verified)} />
        <StatCard label="On hold" value={formatNumber(campaign.stats.onHold)} />
        <StatCard label="Completed" value={formatNumber(campaign.stats.completed)} />
        <StatCard label="Failed" value={formatNumber(campaign.stats.failed)} />
        <StatCard label="Spots left" value={`${campaign.slotsRemaining}/${campaign.slotsTotal}`} />
      </div>

      <div className="admin-split">
        <section className="admin-card">
          <h2>Details</h2>
          <dl className="admin-dl">
            <div>
              <dt>Type</dt>
              <dd className="admin-capitalize">{campaign.type}</dd>
            </div>
            <div>
              <dt>Reward</dt>
              <dd>{formatMoney(campaign.rewardAmount, campaign.rewardCurrency)}</dd>
            </div>
            <div>
              <dt>Hold</dt>
              <dd>{campaign.holdHours} hours</dd>
            </div>
            <div>
              <dt>Schedule</dt>
              <dd>
                {formatDate(campaign.startAt)} – {formatDate(campaign.endAt)}
              </dd>
            </div>
            {campaign.referralTarget ? (
              <div>
                <dt>Referral target</dt>
                <dd>{campaign.referralTarget} verified</dd>
              </div>
            ) : null}
          </dl>
          <p className="admin-muted">{campaign.description}</p>
        </section>

        <section className="admin-card">
          <h2>Recent completions</h2>
          {completions.length === 0 ? (
            <p className="admin-muted">No completions yet.</p>
          ) : (
            <AdminTable label="Campaign completions" minWidth={640} scrollable>
              <thead>
                <tr>
                  <th scope="col" className="col-primary">
                    User
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">Verified</th>
                </tr>
              </thead>
              <tbody>
                {completions.map((c) => (
                  <tr key={c.id}>
                    <td className="col-primary">
                      <strong>{c.displayName}</strong>
                      {c.username ? <div className="admin-muted">@{c.username}</div> : null}
                    </td>
                    <td className="admin-capitalize">{c.status.replace(/_/g, ' ')}</td>
                    <td>{c.verifiedAt ? formatDateTime(c.verifiedAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          )}
        </section>
      </div>
    </section>
  )
}
