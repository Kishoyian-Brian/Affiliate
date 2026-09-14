interface SettingRow {
  label: string
  value: string
  note?: string
}

const settings: SettingRow[] = [
  { label: 'Notifications', value: 'On', note: 'Task updates and reward releases' },
  { label: 'Payout method', value: 'Not set', note: 'Configure in Wallet' },
  { label: 'Referral attribution', value: 'Enabled' },
]

export function ProfileSettings() {
  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Settings</h2>
      </header>

      <dl className="profile-settings-list">
        {settings.map((item) => (
          <div key={item.label} className="profile-setting-row">
            <dt>{item.label}</dt>
            <dd>
              <span>{item.value}</span>
              {item.note ? <small>{item.note}</small> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
