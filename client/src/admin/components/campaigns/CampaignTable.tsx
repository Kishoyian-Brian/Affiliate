import { Link } from 'react-router-dom'
import type { AdminCampaign } from '../../types'
import { getCampaignTargetLabel } from '../../../lib/affiliate'
import { formatDate, formatMoney } from '../../lib/format'
import { AdminTable } from '../ui/AdminTable'
import { CampaignStatusBadge } from './CampaignStatusBadge'

interface CampaignTableProps {
  campaigns: AdminCampaign[]
  onStatusChange: (id: string, status: AdminCampaign['status']) => void
}

export function CampaignTable({ campaigns, onStatusChange }: CampaignTableProps) {
  if (campaigns.length === 0) {
    return <div className="admin-empty">No campaigns yet.</div>
  }

  return (
    <AdminTable label="Campaigns table" minWidth={1040} scrollable>
      <thead>
        <tr>
          <th scope="col" className="col-primary">
            Campaign
          </th>
          <th scope="col">Channel</th>
          <th scope="col">Type</th>
          <th scope="col" className="col-num">
            Reward
          </th>
          <th scope="col">Status</th>
          <th scope="col" className="col-num">
            Verified
          </th>
          <th scope="col" className="col-num">
            Spots
          </th>
          <th scope="col">Ends</th>
          <th scope="col" className="col-actions">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign) => (
          <tr key={campaign.id}>
            <td className="col-primary">
              <Link to={`/admin/campaigns/${campaign.id}`} className="admin-table-link">
                {campaign.title}
              </Link>
            </td>
            <td>{getCampaignTargetLabel(campaign)}</td>
            <td className="admin-capitalize">{campaign.type}</td>
            <td className="col-num">{formatMoney(campaign.rewardAmount, campaign.rewardCurrency)}</td>
            <td>
              <CampaignStatusBadge status={campaign.status} />
            </td>
            <td className="col-num">{campaign.stats.verified}</td>
            <td className="col-num">
              {campaign.slotsRemaining}/{campaign.slotsTotal}
            </td>
            <td>{formatDate(campaign.endAt)}</td>
            <td className="col-actions">
              <div className="admin-row-actions">
                <Link to={`/admin/campaigns/${campaign.id}/edit`} className="admin-btn-text">
                  Edit
                </Link>
                {campaign.status === 'active' ? (
                  <button
                    type="button"
                    className="admin-btn-text"
                    onClick={() => onStatusChange(campaign.id, 'paused')}
                  >
                    Pause
                  </button>
                ) : null}
                {campaign.status === 'paused' ? (
                  <button
                    type="button"
                    className="admin-btn-text"
                    onClick={() => onStatusChange(campaign.id, 'active')}
                  >
                    Resume
                  </button>
                ) : null}
                {campaign.status === 'draft' ? (
                  <button
                    type="button"
                    className="admin-btn-text"
                    onClick={() => onStatusChange(campaign.id, 'active')}
                  >
                    Publish
                  </button>
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}
