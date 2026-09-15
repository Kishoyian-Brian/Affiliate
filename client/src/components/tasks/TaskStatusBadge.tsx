import type { CompletionStatus } from '../../types/task'
import { completionStatusLabels } from '../../lib/task'

export function TaskStatusBadge({ status }: { status: CompletionStatus }) {
  return <span className="badge">{completionStatusLabels[status]}</span>
}
