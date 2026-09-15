import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page not-found-page">
      <header className="page-header">
        <h1>Page not found</h1>
        <p>That URL is not part of Tasklane.</p>
      </header>
      <div className="section-card">
        <Link to="/app" className="btn btn-primary btn-block">
          Go to campaigns
        </Link>
        <Link to="/" className="btn btn-secondary btn-block" style={{ marginTop: 12 }}>
          Home
        </Link>
      </div>
    </section>
  )
}
