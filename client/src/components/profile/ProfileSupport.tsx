export function ProfileSupport() {
  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Support</h2>
      </header>

      <dl className="profile-details">
        <div className="profile-detail-row">
          <dt>Missing reward</dt>
          <dd>Allow up to 24h after hold period ends before contacting support.</dd>
        </div>
        <div className="profile-detail-row">
          <dt>Verification issues</dt>
          <dd>Ensure you subscribed before tapping Verify. The bot must have access to the channel.</dd>
        </div>
        <div className="profile-detail-row">
          <dt>Contact</dt>
          <dd>
            <a href="https://t.me/TasklaneSupport" target="_blank" rel="noopener noreferrer">
              @TasklaneSupport
            </a>
          </dd>
        </div>
      </dl>
    </section>
  )
}
