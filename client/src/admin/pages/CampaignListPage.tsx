import { useCallback, useEffect, useState } from 'react'
import { CampaignTable } from '../components/campaigns/CampaignTable'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/errors'
import { deleteCampaign, fetchCampaigns, setCampaignStatus } from '../lib/api'
import type { AdminCampaign } from '../types'

export function CampaignListPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCampaigns(await fetchCampaigns())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleStatusChange(id: string, status: AdminCampaign['status']) {
    await setCampaignStatus(id, status)
    await load()
  }

  async function handleDelete(id: string) {
    const campaign = campaigns.find((item) => item.id === id)
    const confirmed = window.confirm(`Delete “${campaign?.title ?? 'this campaign'}”? This cannot be undone.`)
    if (!confirmed) return
    try {
      await deleteCampaign(id)
      toast('Campaign deleted', 'success')
      await load()
    } catch (err) {
      toast(getErrorMessage(err, 'Could not delete campaign'), 'error')
    }
  }

  return (
    <section>
      <PageHeader
        title="Campaigns"
        description="All campaigns you publish to the earner Mini App."
        action={{ label: 'New campaign', to: '/admin/campaigns/new' }}
      />
      {loading ? (
        <div className="admin-loading">Loading campaigns…</div>
      ) : (
        <CampaignTable
          campaigns={campaigns}
          onStatusChange={(id, s) => void handleStatusChange(id, s)}
          onDelete={(id) => void handleDelete(id)}
        />
      )}
    </section>
  )
}
