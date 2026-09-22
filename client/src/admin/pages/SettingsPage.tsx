import { PageHeader } from '../components/ui/PageHeader'

export function SettingsPage() {
  return (
    <section>
      <PageHeader
        title="Settings"
        description="Platform defaults. Values below match the live API."
      />

      <div className="admin-card">
        <h2>Defaults</h2>
        <dl className="admin-dl">
          <div>
            <dt>Default hold period</dt>
            <dd>48 hours</dd>
          </div>
          <div>
            <dt>Minimum withdrawal</dt>
            <dd>$5.00</dd>
          </div>
          <div>
            <dt>Withdrawal fee</dt>
            <dd>2%</dd>
          </div>
          <div>
            <dt>Earner Mini App URL</dt>
            <dd>/app</dd>
          </div>
        </dl>
        <p className="admin-muted">
          Bot token, Mini App URL, and JWT secrets are configured on the server via environment
          variables. Campaigns, users, and withdrawals are live from the API.
        </p>
      </div>
    </section>
  )
}
