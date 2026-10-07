import type { CSSProperties } from 'react'
import { LuCheck, LuCircleCheck, LuCircleX, LuClock, LuTriangleAlert } from 'react-icons/lu'
import { Link, Navigate } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { LINK_BUTTON, OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { getLoanPackage } from '@/data/loanPackages'
import { useApplication } from '@/features/application/ApplicationContext'
import { isSubmitted, STATUS_MESSAGES, VERIFY_MESSAGE, type StatusTone } from '@/features/application/status'
import { useTimeline } from '@/features/application/useTimeline'
import { cn } from '@/lib/cn'
import { formatDateTime, formatNaira } from '@/lib/format'

const TONE_ICONS: Record<StatusTone, typeof LuClock> = {
  progress: LuClock,
  success: LuCircleCheck,
  negative: LuCircleX,
  warning: LuTriangleAlert,
}

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function TrackApplication() {
  const { data, loading } = useApplication()
  const { timeline, error } = useTimeline(isSubmitted(data.status) ? data.id : null)

  if (loading) return null
  if (!isSubmitted(data.status)) return <Navigate to="/applications" replace />

  const summary = timeline?.summary ?? data.summary
  const status = timeline?.status ?? data.status
  const tone = summary?.tone ?? 'progress'
  const Icon = TONE_ICONS[tone]
  const stages = timeline?.stages ?? []
  const reached = stages.reduce((last, stage, index) => (stage.state === 'upcoming' ? last : index), -1)
  const lineWidth = stages.length ? ((reached + (stages[reached]?.state === 'done' ? 1 : 0.5)) / stages.length) * 100 : 0

  const details = [
    { label: 'Application ID', value: data.reference ?? '—' },
    { label: 'Requested amount', value: formatNaira(data.amount) || '—' },
    { label: 'Date submitted', value: data.submittedAt ? formatDateTime(data.submittedAt) : '—' },
    { label: 'Last updated', value: timeline ? formatDateTime(timeline.lastUpdated) : '—' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Application Status"
        title={`Your ${getLoanPackage(data.loanPackage).shortName} Application`}
        description="Track progress and see whether you need to take any action."
      />

      <div className="flex flex-col gap-4">
        <section
          className="anim-fade-up overflow-hidden rounded-[20px] bg-[#5e2095] p-6 text-white sm:p-[35px]"
          style={delay(80)}
        >
          <div className="flex items-start gap-8">
            <div className="min-w-0 flex-1">
              <span className="inline-flex min-h-7 items-center gap-[7px] rounded-[20px] bg-white/15 px-2.5 py-1">
                <span className={cn('size-[7px] rounded-full bg-white', tone === 'progress' && 'animate-pulse')} />
                <span className="font-inter text-[12px] leading-[18.6px] font-bold">{summary?.label ?? 'Submitted'}</span>
              </span>
              <h2 className="mt-3 font-inter text-[22px] leading-[31px] font-bold tracking-[-0.5px] sm:text-[26px]">
                Current Status: {summary?.label ?? 'Submitted'}
              </h2>
              <p className="mt-2 max-w-[720px] font-inter text-[16px] leading-[25px] text-white/80">
                {summary?.action === 'verify_identity' ? VERIFY_MESSAGE : status && status !== 'draft' ? STATUS_MESSAGES[status] : ''}
              </p>
              {summary?.action === 'verify_identity' && (
                <Link
                  to="/verify-identity"
                  className="mt-5 inline-flex min-h-[46px] items-center rounded-[10px] bg-white px-5 font-inter text-[16px] font-bold text-lms-purple transition-transform hover:-translate-y-px"
                >
                  Verify My Identity
                </Link>
              )}
              {error && <p className="mt-2 font-inter text-[14px] text-white/80">{error}</p>}
              <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-white/10 pt-7 lg:grid-cols-4">
                {details.map(({ label, value }) => (
                  <div key={label} className="flex min-w-0 flex-col gap-1">
                    <dt className="font-inter text-[13px] leading-[20px] text-white/70">{label}</dt>
                    <dd className="font-inter text-[16px] leading-[24px] font-bold break-words sm:text-[18px] sm:leading-[26px]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <span className="mt-[62px] hidden size-[100px] shrink-0 items-center justify-center rounded-full bg-white/10 md:flex">
              <Icon className="size-[34px] text-lms-lilac" />
            </span>
          </div>
        </section>

        <section
          className="anim-fade-up rounded-[16px] border border-app-line bg-white px-5 pt-10 pb-10 sm:px-[29px] sm:pt-12"
          style={delay(160)}
        >
          <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
            Application progress
          </h2>
          <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">
            Stages may vary depending on the review required for your application.
          </p>

          <div className="mt-9 overflow-x-auto pb-1">
            <ol className="relative grid min-w-[720px]" style={{ gridTemplateColumns: `repeat(${stages.length || 1}, minmax(0, 1fr))` }}>
              <span className="absolute top-[15px] right-0 left-0 h-[2px] bg-app-line" />
              {stages.length > 0 && (
                <span
                  className="anim-grow-x absolute top-[15px] left-0 h-[2px] bg-lms-purple"
                  style={{ width: `${lineWidth}%`, '--delay': '500ms' } as CSSProperties}
                />
              )}
              {stages.map((stage, index) => {
                const done = stage.state === 'done'
                const stopped = stage.state === 'failed'
                const here = stage.state === 'current'
                return (
                  <li
                    key={stage.name}
                    aria-current={here ? 'step' : undefined}
                    className="anim-fade-up relative flex flex-col items-center gap-3 text-center"
                    style={delay(300 + index * 60)}
                  >
                    <span
                      className={cn(
                        'relative z-[1] flex size-[30px] items-center justify-center rounded-full border font-inter text-[12px]',
                        stopped
                          ? 'border-[#b4282d] bg-[#b4282d] text-white'
                          : done || here
                            ? 'border-lms-purple bg-lms-purple text-white'
                            : 'border-app-line bg-white text-[#a09aa5]',
                        here && 'anim-pulse-ring-purple',
                      )}
                    >
                      {stopped ? <LuCircleX className="size-4" /> : done ? <LuCheck className="size-3.5" strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        'font-inter text-[12.5px] leading-[18px]',
                        stopped ? 'font-bold text-[#b4282d]' : done || here ? 'font-bold text-lms-purple' : 'font-semibold text-[#a09aa5]',
                      )}
                    >
                      {stage.name}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      </div>

      <div className="anim-fade-up -mt-4 flex flex-wrap items-center gap-x-6 gap-y-2" style={delay(240)}>
        <Link to="/history" className={OUTLINE_BUTTON}>
          View Application History
        </Link>
        {status === 'closed' && (
          <Link to="/loan-packages" className={PRIMARY_BUTTON}>
            Start a New Application
          </Link>
        )}
        <a href="tel:8001301448" className={LINK_BUTTON}>
          Contact Support
        </a>
      </div>
    </div>
  )
}
