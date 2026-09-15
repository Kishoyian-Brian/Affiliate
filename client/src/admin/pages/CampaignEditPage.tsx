import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CampaignForm } from '../components/campaigns/CampaignForm'
import { PageHeader } from '../components/ui/PageHeader'
import { fetchCampaign, updateCampaign } from '../lib/api'
import type { AdminCampaign, CampaignInput } from '../types'

export function CampaignEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<AdminCampaign | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchCampaign(id).then((data) => {
      setCampaign(data ?? null)
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(input: CampaignInput) {
    setSaving(true)
    try {
      await updateCampaign(id, input)
      navigate(`/admin/campaigns/${id}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading…</div>
  if (!campaign) return <div className="admin-empty">Campaign not found.</div>

  return (
    <section>
      <PageHeader title="Edit campaign" description={campaign.title} />
      <CampaignForm
        initial={campaign}
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/campaigns/${id}`)}
      />
    </section>
  )
}
