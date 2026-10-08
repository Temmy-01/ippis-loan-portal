import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import illusDocument from '@/assets/app/illus-document.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { StatusPill } from '@/components/app/StatusPill'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { getLoanPackage } from '@/data/loanPackages'
import { useApplication } from '@/features/application/ApplicationContext'
import { getProgress } from '@/features/application/progress'
import { cn } from '@/lib/cn'
import { formatDate, formatNaira } from '@/lib/format'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function MyApplications() {
  const navigate = useNavigate()
  const { data } = useApplication()
  const progress = getProgress(data)

  const details = [
    { label: 'How much do you need', value: data.amount ? formatNaira(data.amount) : 'Not set yet' },
    { label: 'Date Started', value: data.startedAt ? formatDate(data.startedAt.slice(0, 10)) : '' },
    { label: 'Last Updated', value: data.updatedAt ? formatDate(data.updatedAt.slice(0, 10)) : '' },
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
          description="View and manage your current and previous IPPIS loan applications."
        />
        {(!progress.started || progress.submitted) && (
          <button type="button" onClick={() => navigate('/loan-packages')} className={cn(PRIMARY_BUTTON, 'anim-fade-up')} style={delay(120)}>
            Start New Application
          </button>
        )}
      </div>

      {progress.started ? (
        <section
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
              <h2 className="pt-1.5 font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
                {getLoanPackage(data.loanPackage).shortName} Application
              </h2>
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
        </section>
      ) : null}

      <section
        className="anim-fade-up -mt-1 flex items-center gap-[15px] rounded-[16px] border border-dashed border-[#d9d5dc] px-5 py-6 sm:px-7"
        style={delay(240)}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white">
          <img src={illusDocument} alt="" className="block size-5" />
        </span>
        <div>
          <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">
            {progress.started ? 'No other applications' : 'No applications yet'}
          </p>
          <p className="font-inter text-[13px] leading-[20.15px] text-app-muted">
            {progress.started
              ? 'Any additional applications will appear here.'
              : 'Start a new application and it will appear here.'}
          </p>
        </div>
      </section>
    </div>
  )
}
