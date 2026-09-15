import { useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { UserTable } from '../components/users/UserTable'
import { fetchUsers } from '../lib/api'
import type { EarnerUser } from '../types'

export function UsersPage() {
  const [users, setUsers] = useState<EarnerUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchUsers().then((data) => {
      setUsers(data)
      setLoading(false)
    })
  }, [])

  return (
    <section>
      <PageHeader title="Users" description="Earner accounts in the Mini App." />

      {loading ? (
        <div className="admin-loading">Loading users…</div>
      ) : (
        <UserTable users={users} />
      )}
    </section>
  )
}
