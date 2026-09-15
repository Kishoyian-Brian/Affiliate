import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description?: string
  action?: { label: string; to: string }
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? (
        <Link to={action.to} className="admin-btn admin-btn-primary">
          {action.label}
        </Link>
      ) : null}
    </header>
  )
}
