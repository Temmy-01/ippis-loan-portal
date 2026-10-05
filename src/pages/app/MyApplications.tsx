import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import illusDocument from '@/assets/app/illus-document.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { mockApplication } from '@/data/mockUser'
import { formatNaira } from '@/lib/format'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function MyApplications() {
  const { id, amount, dateStarted, lastUpdated, completedSteps, totalSteps, nextStepPath } = mockApplication
  const completion = Math.round((completedSteps / totalSteps) * 100)

  const details = [
    { label: 'Requested Loan Amount', value: formatNaira(amount), sample: true },
    { label: 'Date Started', value: dateStarted },
    { label: 'Last Updated', value: lastUpdated },
    { label: 'Completion', value: `${completion}%` },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="My Applications"
          title="Your applications"
          description="View and manage your current and previous IPPIS loan applications."
        />
        <Link to="/apply" className={`${PRIMARY_BUTTON} anim-fade-up`} style={delay(120)}>
          Start New Application
        </Link>
      </div>

      <section
        className="anim-fade-up rounded-[16px] border border-app-line bg-white px-5 pt-8 pb-7 transition-shadow duration-300 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)] sm:px-7 sm:pt-10"
        style={delay(160)}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-[7px]">
            <span className="flex min-h-7 items-center gap-[7px] self-start rounded-[20px] bg-amber-soft px-2.5 py-1">
              <span className="size-[7px] rounded-full bg-amber" />
              <span className="font-inter text-[12px] leading-[18.6px] font-bold text-amber">Draft</span>
            </span>
            <h2 className="pt-1.5 font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
              IPPIS Loan Application
            </h2>
            <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">Application ID: {id}</p>
          </div>
          <Link to={nextStepPath} className={PRIMARY_BUTTON}>
            Continue Application
          </Link>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-app-line pt-6 md:grid-cols-4">
          {details.map(({ label, value, sample }) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">{label}</dt>
              <dd className="flex items-baseline gap-2 font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">
                {value}
                {sample && (
                  <span className="font-inter text-[9px] font-extrabold tracking-[0.6px] text-lms-purple uppercase">
                    Sample data
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="anim-fade-up -mt-1 flex items-center gap-[15px] rounded-[16px] border border-dashed border-[#d9d5dc] px-5 py-6 sm:px-7"
        style={delay(240)}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white">
          <img src={illusDocument} alt="" className="block size-5" />
        </span>
        <div>
          <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">No other applications</p>
          <p className="font-inter text-[13px] leading-[20.15px] text-app-muted">Any additional applications will appear here.</p>
        </div>
      </section>
    </div>
  )
}
