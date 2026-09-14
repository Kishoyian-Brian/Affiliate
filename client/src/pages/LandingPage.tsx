import { Link } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import '../styles/landing.css'

const features = [
  {
    title: 'Bot-verified subscriptions',
    description:
      'Rewards unlock only after Telegram confirms channel membership. No honor system, no fake clicks.',
  },
  {
    title: 'Hold-period protection',
    description:
      'Users must stay subscribed for a set period before rewards release — protecting channel owners from churn.',
  },
  {
    title: 'Referral milestones',
    description:
      'Run “get 10 verified subscribers” campaigns with live progress tracking and shareable Telegram deep links.',
  },
  {
    title: 'Anti-cheat by design',
    description:
      'Referrals count only after the referred user independently passes verification — not on link clicks.',
  },
  {
    title: 'Transparent rewards',
    description:
      'Clear wallet with available balance, pending holds, and full reward history so users always know where they stand.',
  },
  {
    title: 'Native Telegram experience',
    description:
      'Built as a Mini App — join channels, verify, and share without leaving Telegram.',
  },
]

const faqs = [
  {
    q: 'How is this different from “click verify and get paid”?',
    a: 'Every completion is checked against the Telegram Bot API. If the user is not a member of the target channel, the task stays incomplete and no reward is issued.',
  },
  {
    q: 'When do referrers get credit?',
    a: 'Only after the referred person joins the channel and passes their own independent verification. Opening a link or pressing a button is not enough.',
  },
  {
    q: 'Can users subscribe, get paid, and leave immediately?',
    a: 'Campaigns can require a hold period (e.g. 48 hours). If the user unsubscribes before the hold ends, the pending reward may be cancelled.',
  },
  {
    q: 'Who is this platform for?',
    a: 'Channel owners who want real, verified subscribers — and users who earn by completing tasks and sharing referral links inside Telegram.',
  },
]

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo to="/" className="landing-logo brand-logo" />
        <nav className="landing-nav-links" aria-label="Landing navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#for-owners">For owners</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="landing-nav-actions">
          <Link to="/app" className="landing-btn-ghost">
            Open app
          </Link>
          <Link to="/app" className="landing-btn-primary">
            Start earning
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-badge">Telegram-native · Verified rewards</div>
          <h1>
            Earn from channels.
            <br />
            <span>Verified, not guessed.</span>
          </h1>
          <p className="landing-hero-lead">
            Tasklane connects Telegram users with paid subscription tasks. Join a channel,
            prove your membership, earn rewards — or refer friends and unlock milestone bonuses.
          </p>
          <div className="landing-hero-cta">
            <Link to="/app" className="landing-btn-primary">
              Launch Mini App
            </Link>
            <a href="#how-it-works" className="landing-btn-outline">
              See how it works
            </a>
          </div>
        </div>

        <div className="landing-preview" aria-hidden="true">
          <div className="landing-preview-glow" />
          <div className="landing-floating-card card-verified">
            <strong>Verified</strong>
            <span>@cryptodaily member</span>
          </div>
          <div className="landing-floating-card card-earned">
            <strong>+$1.00</strong>
            <span>Reward pending · 47h left</span>
          </div>
          <div className="landing-phone">
            <div className="landing-phone-screen">
              <div className="landing-phone-header">
                <strong>Tasklane</strong>
                <span className="landing-mock-reward">$12.50</span>
              </div>
              <div className="landing-phone-body">
                <div className="landing-mock-task">
                  <div className="landing-mock-task-top">
                    <div>
                      <h4>Subscribe to Crypto Daily</h4>
                      <p>@cryptodaily · 84.2K members · 3 min</p>
                    </div>
                    <span className="landing-mock-reward">$1.00</span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: 'var(--muted)' }}>
                    Join, verify, earn after 48h hold · 143 spots left
                  </p>
                  <button type="button" className="landing-mock-btn">
                    Verify subscription
                  </button>
                </div>
                <div className="landing-mock-task">
                  <div className="landing-mock-task-top">
                    <div>
                      <h4>Refer 10 to Tech Hub</h4>
                      <p>@techhub · Milestone · 15 min</p>
                    </div>
                    <span className="landing-mock-reward">$5.00</span>
                  </div>
                  <div className="landing-mock-progress">
                    <div className="landing-mock-progress-fill" />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted)' }}>
                    7 verified · 1 pending · 3 more to unlock
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-stats">
          <article className="landing-stat">
            <strong>100%</strong>
            <p>Bot-verified completions</p>
            <cite>No self-reported subscriptions</cite>
          </article>
          <article className="landing-stat">
            <strong>48h</strong>
            <p>Default hold period</p>
            <cite>Reduces subscribe-and-leave abuse</cite>
          </article>
          <article className="landing-stat">
            <strong>0</strong>
            <p>Credit on link clicks alone</p>
            <cite>Referrals need independent verification</cite>
          </article>
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="landing-section-header">
          <h2>Built for real growth, not fake numbers</h2>
          <p>
            Most “task” apps trust the user. Tasklane trusts Telegram — every reward is backed
            by a membership check your channel owner can rely on.
          </p>
        </div>
        <div className="landing-features">
          {features.map((feature) => (
            <article key={feature.title} className="landing-feature">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <div className="landing-section-header">
          <h2>How it works</h2>
          <p>Three steps for earners. One verification pipeline behind the scenes.</p>
        </div>
        <div className="landing-steps">
          <article className="landing-step">
            <div className="landing-step-num">1</div>
            <div>
              <h3>Pick a task</h3>
              <p>
                Browse subscribe or referral campaigns inside the Mini App. Each task shows the
                channel, reward, and hold rules upfront.
              </p>
            </div>
          </article>
          <article className="landing-step">
            <div className="landing-step-num">2</div>
            <div>
              <h3>Join & verify</h3>
              <p>
                Tap join to open the channel in Telegram, subscribe, then verify. Your backend
                asks the Bot API: is this user actually a member?
              </p>
            </div>
          </article>
          <article className="landing-step">
            <div className="landing-step-num">3</div>
            <div>
              <h3>Earn or refer</h3>
              <p>
                Rewards go to your wallet after the hold period. Referral tasks unlock when
                enough friends pass their own verification.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-split">
          <div>
            <div className="landing-section-header" style={{ textAlign: 'left', margin: '0 0 24px' }}>
              <h2>Verification you can trust</h2>
              <p style={{ margin: 0 }}>
                The Mini App never decides on its own. It sends the user’s signed Telegram
                identity to your backend, which checks membership and records the result.
              </p>
            </div>
            <div className="landing-flow">
              <div className="landing-flow-item done">
                <span className="landing-flow-dot" />
                User joins @channel in Telegram
              </div>
              <div className="landing-flow-item done">
                <span className="landing-flow-dot" />
                Backend calls Bot API for membership status
              </div>
              <div className="landing-flow-item done">
                <span className="landing-flow-dot" />
                Completion recorded · reward enters hold
              </div>
              <div className="landing-flow-item">
                <span className="landing-flow-dot" />
                Still subscribed after hold? Reward released
              </div>
            </div>
          </div>
          <div className="landing-split-visual">
            <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '0.85rem' }}>
              Accepted membership statuses
            </p>
            <div className="landing-flow">
              <div className="landing-flow-item done">
                <span className="landing-flow-dot" />
                member
              </div>
              <div className="landing-flow-item done">
                <span className="landing-flow-dot" />
                administrator
              </div>
              <div className="landing-flow-item done">
                <span className="landing-flow-dot" />
                creator
              </div>
            </div>
            <p style={{ margin: '20px 0 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Rejected: left, kicked, or not found
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section" id="for-owners">
        <div className="landing-section-header">
          <h2>Two sides. One platform.</h2>
          <p>Tasklane serves channel owners who pay for growth and users who earn by completing verified tasks.</p>
        </div>
        <div className="landing-audience">
          <article className="landing-audience-card">
            <h3>For earners</h3>
            <p>Complete tasks, share referral links, track your wallet — all inside Telegram.</p>
            <ul>
              <li>Task feed with filters</li>
              <li>One-tap join & verify flow</li>
              <li>Referral progress bars</li>
              <li>Pending vs available balance</li>
            </ul>
          </article>
          <article className="landing-audience-card highlight">
            <h3>For channel owners</h3>
            <p>Pay for verified subscribers, not empty clicks. Set budgets, hold rules, and campaign end dates.</p>
            <ul>
              <li>Create subscribe & referral campaigns</li>
              <li>Bot setup checklist before go-live</li>
              <li>Live verified vs pending stats</li>
              <li>Pause or stop campaigns anytime</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-section" id="faq">
        <div className="landing-section-header">
          <h2>Common questions</h2>
        </div>
        <div className="landing-faq">
          {faqs.map((item) => (
            <details key={item.q} className="landing-faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to earn — or launch a campaign?</h2>
        <p>
          Open the Mini App to browse live tasks, or connect your channel to start acquiring
          verified subscribers.
        </p>
        <Link to="/app" className="landing-btn-primary" style={{ minHeight: 48, padding: '12px 28px' }}>
          Get started free
        </Link>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Tasklane</span>
        <span>Telegram-verified task rewards</span>
      </footer>
    </div>
  )
}
