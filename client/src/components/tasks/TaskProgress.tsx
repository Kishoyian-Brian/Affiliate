import type { Task } from '../../types/task'
import { formatSlotsRemaining } from '../../lib/format'
import { isSlotsLow } from '../../lib/task'

interface TaskProgressProps {
  task: Task
}

export function TaskProgress({ task }: TaskProgressProps) {
  const slotsPct = task.slotsTotal > 0 ? (task.slotsRemaining / task.slotsTotal) * 100 : 0
  const slotsLow = isSlotsLow(task)

  return (
    <div className={`task-slots ${slotsLow ? 'task-slots-low' : ''}`}>
      <div className="task-slots-top">
        <span>Capacity remaining</span>
        <strong>
          {formatSlotsRemaining(task.slotsRemaining, task.slotsTotal)} · {Math.round(slotsPct)}%
        </strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${slotsPct}%` }} />
      </div>
    </div>
  )
}
