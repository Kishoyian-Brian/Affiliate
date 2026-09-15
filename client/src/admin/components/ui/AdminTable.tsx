import type { ReactNode } from 'react'

interface AdminTableProps {
  label: string
  minWidth?: number
  scrollable?: boolean
  children: ReactNode
}

export function AdminTable({
  label,
  minWidth = 920,
  scrollable = false,
  children,
}: AdminTableProps) {
  return (
    <div className="admin-table-shell">
      <div
        className={`admin-table-wrap${scrollable ? ' admin-table-wrap-scroll' : ''}`}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <table className="admin-table" style={{ minWidth }}>
          {children}
        </table>
      </div>
      <p className="admin-table-scroll-hint" aria-hidden="true">
        Scroll horizontally to see all columns
      </p>
    </div>
  )
}
