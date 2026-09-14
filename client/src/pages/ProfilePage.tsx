import { useEffect } from 'react'
import { ProfileAccount } from '../components/profile/ProfileAccount'
import { ProfileActivity } from '../components/profile/ProfileActivity'
import { ProfileSettings } from '../components/profile/ProfileSettings'
import { ProfileSupport } from '../components/profile/ProfileSupport'
import { useProfile } from '../hooks/useProfile'

export function ProfilePage() {
  const { profile, loading, error, reload } = useProfile()

  useEffect(() => {
    document.title = 'Tasklane — Account'
  }, [])

  if (loading) {
    return <div className="state-block">Loading account…</div>
  }

  if (error || !profile) {
    return (
      <section className="page">
        <div className="state-block state-error">
          <p>{error ?? 'Account unavailable'}</p>
          <button type="button" className="btn btn-secondary" onClick={() => void reload()}>
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="page profile-page">
      <header className="page-header">
        <h1>Account</h1>
        <p>Profile, activity, and support.</p>
      </header>

      <ProfileAccount user={profile.user} />
      <ProfileActivity user={profile.user} activity={profile.recentActivity} />
      <ProfileSettings />
      <ProfileSupport />
    </section>
  )
}
