import { AdminTable } from '../ui/AdminTable'
import { formatDate, formatMoney } from '../../lib/format'
import type { EarnerUser } from '../../types'

export function UserTable({ users }: { users: EarnerUser[] }) {
  return (
    <AdminTable label="Users table" minWidth={960} scrollable>
      <thead>
        <tr>
          <th scope="col" className="col-primary">
            User
          </th>
          <th scope="col" className="col-num">
            Telegram ID
          </th>
          <th scope="col" className="col-num">
            Balance
          </th>
          <th scope="col" className="col-num">
            Pending
          </th>
          <th scope="col" className="col-num">
            Completed
          </th>
          <th scope="col">Status</th>
          <th scope="col">Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="col-primary">
              <strong>{user.displayName}</strong>
              {user.username ? <div className="admin-muted">@{user.username}</div> : null}
            </td>
            <td className="col-num admin-mono">{user.telegramId}</td>
            <td className="col-num">{formatMoney(user.balance, user.currency)}</td>
            <td className="col-num">{formatMoney(user.pendingBalance, user.currency)}</td>
            <td className="col-num">{user.completedTasks}</td>
            <td>
              <span className={`admin-badge admin-badge-user-${user.accountStatus}`}>
                {user.accountStatus}
              </span>
            </td>
            <td>{formatDate(user.memberSince)}</td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}
