import { useEffect, useState, type CSSProperties } from 'react'
import { LuChevronRight } from 'react-icons/lu'
import { Link, useNavigate } from 'react-router-dom'

import illusDocument from '@/assets/app/illus-document.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { StatusPill } from '@/components/app/StatusPill'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { getLoanPackage, type LoanPackageId } from '@/data/loanPackages'
import { useApplication } from '@/features/application/ApplicationContext'
import { getProgress } from '@/features/application/progress'
import { isFinished, type ApplicationStatus, type StatusSummary } from '@/features/application/status'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { formatDate, formatNaira } from '@/lib/format'

type ApplicationRow = {
  id: string
  reference: string
  loanPackage: LoanPackageId
  status: ApplicationStatus
  summary: StatusSummary | null
  data: { amount?: string }
  submittedAt: string | null
  updatedAt: string
}

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

const day = (value?: string | null) => (value ? formatDate(value.slice(0, 10)) : '—')

function CompletedRow({ app, index }: { app: ApplicationRow; index: number }) {
  return (
    <li className="anim-fade-up" style={delay(260 + Math.min(index, 8) * 70)}>
      <Link
        to={`/applications/${app.id}`}
        className="group flex items-center gap-4 rounded-[14px] border border-app-line bg-white px-5 py-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)] sm:px-7"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="font-inter text-[16px] leading-[24px] font-bold text-app-ink">
              {getLoanPackage(app.loanPackage).shortName} Application
            </p>
            <p className="font-inter text-[13px] leading-[20px] text-app-muted">
              {app.reference} · {formatNaira(app.data?.amount ?? '') || '—'} · Submitted {day(app.submittedAt)}
            </p>
          </div>
          {app.summary && <StatusPill tone={app.summary.tone} label={app.summary.label} />}
        </div>
        <span className="flex items-center gap-1 font-inter text-[14px] font-bold text-lms-purple">
          View
          <LuChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </Link>
    </li>
  )
}

export default function MyApplications() {
  const navigate = useNavigate()
  const { data } = useApplication()
  const progress = getProgress(data)
  const [apps, setApps] = useState<ApplicationRow[] | null>(null)

  useEffect(() => {
    api<ApplicationRow[]>('/portal/applications', { auth: true }).then((result) => {
      setApps(result.ok && result.payload ? result.payload : [])
    })
  }, [])

  const hasCurrent = progress.started && !isFinished(data.status)
  const completed = (apps ?? []).filter((app) => isFinished(app.status))

  const details = [
    { label: 'How much do you need?', value: data.amount ? formatNaira(data.amount) : 'Not set yet' },
    { label: 'Date Started', value: day(data.startedAt) },
    { label: 'Last Updated', value: day(data.updatedAt) },
    progress.submitted
      ? { label: 'Status', value: data.summary?.label ?? 'Submitted' }
      : { label: 'Completion', value: `${progress.percent}%` },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="My Applications"
          title="Your applications"
          description="View your current application and the ones you have completed."
        />
        {!hasCurrent && (
          <button type="button" onClick={() => navigate('/loan-packages')} className={cn(PRIMARY_BUTTON, 'anim-fade-up')} style={delay(120)}>
            Start New Application
          </button>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-inter text-[18px] leading-[28px] font-bold text-app-ink">Current application</h2>
        {hasCurrent ? (
          <div
            className="anim-fade-up rounded-[16px] border border-app-line bg-white px-5 pt-8 pb-7 transition-shadow duration-300 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)] sm:px-7 sm:pt-10"
            style={delay(160)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-[7px]">
                {progress.submitted ? (
                  <StatusPill tone={data.summary?.tone ?? 'progress'} label={data.summary?.label ?? 'Submitted'} />
                ) : (
                  <StatusPill tone="warning" label="Draft" />
                )}
                <h3 className="pt-1.5 font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
                  {getLoanPackage(data.loanPackage).shortName} Application
                </h3>
                <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">Application ID: {data.reference}</p>
              </div>
              <Link to={progress.nextStepPath} className={PRIMARY_BUTTON}>
                {progress.submitted ? 'Track Application' : 'Continue Application'}
              </Link>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-app-line pt-6 md:grid-cols-4">
              {details.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">{label}</dt>
                  <dd className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <div
            className="anim-fade-up flex items-center gap-[15px] rounded-[16px] border border-dashed border-[#d9d5dc] px-5 py-6 sm:px-7"
            style={delay(160)}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white">
              <img src={illusDocument} alt="" className="block size-5" />
            </span>
            <div>
              <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">No application in progress</p>
              <p className="font-inter text-[13px] leading-[20.15px] text-app-muted">Start a new application whenever you are ready.</p>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-inter text-[18px] leading-[28px] font-bold text-app-ink">Completed applications</h2>
        {apps === null ? null : completed.length === 0 ? (
          <p
            className="anim-fade-up rounded-[16px] border border-dashed border-[#d9d5dc] px-5 py-6 font-inter text-[14px] text-app-muted sm:px-7"
            style={delay(240)}
          >
            Applications that are disbursed, not approved or closed will appear here.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {completed.map((app, index) => (
              <CompletedRow key={app.id} app={app} index={index} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
