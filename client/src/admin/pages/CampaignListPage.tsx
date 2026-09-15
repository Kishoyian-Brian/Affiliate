import { useCallback, useEffect, useState } from 'react'
import { CampaignTable } from '../components/campaigns/CampaignTable'
import { PageHeader } from '../components/ui/PageHeader'
import { fetchCampaigns, setCampaignStatus } from '../lib/api'
import type { AdminCampaign } from '../types'

export function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchCampaigns()
    setCampaigns(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleStatusChange(id: string, status: AdminCampaign['status']) {
    await setCampaignStatus(id, status)
    await load()
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
        <CampaignTable campaigns={campaigns} onStatusChange={(id, s) => void handleStatusChange(id, s)} />
      )}
    </section>
  )
}
