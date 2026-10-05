import type { CSSProperties } from 'react'
import { LuCheck, LuClock } from 'react-icons/lu'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { LINK_BUTTON, OUTLINE_BUTTON } from '@/components/apply/buttonStyles'
import { mockApplication } from '@/data/mockUser'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'
import { formatDate, formatNaira } from '@/lib/format'

const STAGES = [
  'Application Started',
  'Submitted',
  'Under Review',
  'Verification',
  'Decision',
  'Loan Offer',
  'Offer Accepted',
  'Disbursement',
]

const CURRENT_STAGE = 2

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function TrackApplication() {
  const { data } = useApplication()
  const submitted = data.submittedAt ? formatDate(data.submittedAt.slice(0, 10)) : mockApplication.dateSubmitted

  const details = [
    { label: 'Application ID', value: mockApplication.id },
    { label: 'Requested amount', value: formatNaira(data.amount || mockApplication.amount), sample: !data.amount },
    { label: 'Date submitted', value: submitted },
    { label: 'Last updated', value: mockApplication.statusUpdated },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Application Status"
        title="Your IPPIS Loan Application"
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
                <span className="size-[7px] animate-pulse rounded-full bg-white" />
                <span className="font-inter text-[12px] leading-[18.6px] font-bold">Under Review</span>
              </span>
              <h2 className="mt-3 font-inter text-[22px] leading-[31px] font-bold tracking-[-0.5px] sm:text-[26px]">
                Current Status: Under Review
              </h2>
              <p className="mt-2 max-w-[720px] font-inter text-[16px] leading-[25px] text-white/80">
                Your application has been submitted successfully and is currently being reviewed by our loan team.
                We'll notify you when there is an update or when an action is required from you.
              </p>
              <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-white/10 pt-7 lg:grid-cols-4">
                {details.map(({ label, value, sample }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <dt className="font-inter text-[13px] leading-[20px] text-white/70">{label}</dt>
                    <dd className="flex items-baseline gap-2 font-inter text-[18px] leading-[26px] font-bold">
                      {value}
                      {sample && <span className="text-[9px] font-semibold tracking-[0.5px] text-lms-purple uppercase">Sample</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <span className="mt-[62px] hidden size-[100px] shrink-0 items-center justify-center rounded-full bg-white/10 md:flex">
              <LuClock className="size-[34px] text-lms-lilac" />
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
            <ol className="relative grid min-w-[720px] grid-cols-8">
              <span className="absolute top-[15px] right-0 left-0 h-[2px] bg-app-line" />
              <span
                className="anim-grow-x absolute top-[15px] left-0 h-[2px] bg-lms-purple"
                style={{ width: `${(CURRENT_STAGE / STAGES.length) * 100}%`, '--delay': '500ms' } as CSSProperties}
              />
              {STAGES.map((stage, index) => {
                const done = index < CURRENT_STAGE
                const current = index === CURRENT_STAGE
                return (
                  <li
                    key={stage}
                    aria-current={current ? 'step' : undefined}
                    className="anim-fade-up relative flex flex-col items-center gap-3 text-center"
                    style={delay(300 + index * 60)}
                  >
                    <span
                      className={cn(
                        'relative flex size-[30px] items-center justify-center rounded-full border font-inter text-[12px]',
                        done || current ? 'border-lms-purple bg-lms-purple text-white' : 'border-app-line bg-white text-[#a09aa5]',
                        current && 'anim-pulse-ring-purple',
                      )}
                    >
                      {done ? <LuCheck className="size-3.5" strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        'font-inter text-[12.5px] leading-[18px]',
                        done || current ? 'font-bold text-lms-purple' : 'font-semibold text-[#a09aa5]',
                      )}
                    >
                      {stage}
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
        <Link to="/verify-identity" className={LINK_BUTTON}>
          View Action Required Example
        </Link>
        <a href="tel:8001301448" className={LINK_BUTTON}>
          Contact Support
        </a>
      </div>
    </div>
  )
}
