import { Link } from 'react-router-dom'
import type { Task, TaskCompletion } from '../../types/task'
import { formatDateTime, formatMoney } from '../../lib/format'
import { isAffiliateTask, isTerminalStatus } from '../../lib/task'

interface TaskVerificationProps {
  task: Task
  completion: TaskCompletion | null
  joined: boolean
  verifying: boolean
  verifyMessage: string | null
  onJoin: () => void
  onVerify: () => void
}

export function TaskVerification({
  task,
  completion,
  joined,
  verifying,
  verifyMessage,
  onJoin,
  onVerify,
}: TaskVerificationProps) {
  const status = completion?.status ?? 'not_started'
  const affiliate = isAffiliateTask(task)
  const showJoin = affiliate || (status === 'not_started' && !joined)
  const showVerify =
    !affiliate &&
    !isTerminalStatus(status) &&
    (joined || status === 'awaiting_verification' || status === 'failed')

  return (
    <section className="section-card action-panel">
      <header className="section-header">
        <h2>Actions</h2>
      </header>

      {showJoin ? (
        <div className="action-block">
          <button type="button" className="btn btn-primary btn-block" onClick={onJoin}>
            {affiliate ? 'Launch' : `Join @${task.channelUsername}`}
          </button>
          <p className="helper-text">
            {affiliate
              ? 'Telegram will ask you to launch. Confirm Launch to open it inside Telegram.'
              : 'Opens Telegram. Subscribe to the channel, then return here.'}
          </p>
        </div>
      ) : null}

      {affiliate && (joined || status !== 'not_started') ? (
        <div className="status-callout info">
          <strong>Waiting for a qualified player</strong>
          <p>
            Invite a friend from Telegram. {formatMoney(task.rewardAmount, task.rewardCurrency)} is
            credited when they deposit and actually play.
          </p>
        </div>
      ) : null}

      {showVerify ? (
        <div className="action-block">
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onVerify}
            disabled={verifying}
          >
            {verifying ? 'Checking membership…' : 'Verify subscription'}
          </button>
          <p className="helper-text">
            Confirms your Telegram account is a member of @{task.channelUsername}.
          </p>
        </div>
      ) : null}

      {status === 'verified_pending' ? (
        <div className="status-callout info">
          <strong>Verified — reward on hold</strong>
          <p>
            {formatMoney(task.rewardAmount, task.rewardCurrency)} unlocks{' '}
            {completion?.holdReleaseAt
              ? formatDateTime(completion.holdReleaseAt)
              : `after ${task.holdHours} hours`}{' '}
            if you remain subscribed.
          </p>
          <Link to="/app/wallet" className="action-inline-link">
            View in wallet
          </Link>
        </div>
      ) : null}

      {status === 'completed' ? (
        <div className="status-callout success">
          <strong>Completed</strong>
          <p>{formatMoney(task.rewardAmount, task.rewardCurrency)} paid to your wallet.</p>
          <Link to="/app/wallet" className="action-inline-link">
            View wallet
          </Link>
        </div>
      ) : null}

      {status === 'cancelled' ? (
        <div className="status-callout danger">
          <strong>Reward cancelled</strong>
          <p>{completion?.failureReason ?? 'Hold period requirements were not met.'}</p>
        </div>
      ) : null}

      {status === 'failed' ? (
        <div className="status-callout danger">
          <strong>Verification failed</strong>
          <p>
            {completion?.failureReason ?? verifyMessage ?? 'Subscribe to the channel, then try again.'}
          </p>
        </div>
      ) : null}

      {verifyMessage && status !== 'failed' && status !== 'verified_pending' ? (
        <p className="verify-message">{verifyMessage}</p>
      ) : null}
    </section>
  )
}
