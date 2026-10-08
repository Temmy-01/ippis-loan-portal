import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import iconCheckStep from '@/assets/app/icon-check-step.svg'
import iconCheckWhite from '@/assets/app/icon-check-white.svg'
import iconChevronRight from '@/assets/app/icon-chevron-right.svg'
import iconShield from '@/assets/app/icon-shield.svg'
import illusDocument from '@/assets/app/illus-document.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { StatusPill } from '@/components/app/StatusPill'
import { PrototypeFlows } from '@/components/app/PrototypeFlows'
import { firstNameOf, useSession } from '@/features/auth/session'
import { useApplication } from '@/features/application/ApplicationContext'
import { getProgress } from '@/features/application/progress'
import { STATUS_MESSAGES, STATUS_TITLES, TRACK_STAGE_COUNT, VERIFY_MESSAGE, VERIFY_TITLE } from '@/features/application/status'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

const PRIMARY_LINK =
  'group flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] bg-lms-purple px-[23px] py-3 font-inter text-[16px] leading-[24.8px] font-bold text-white shadow-[0_6px_7px_0_rgb(124_46_191/0.16)] transition-all duration-200 hover:-translate-y-px hover:bg-[#6c25a9] hover:shadow-[0_10px_20px_-6px_rgb(124_46_191/0.5)]'
const SECONDARY_LINK =
  'flex min-h-[50px] items-center justify-center rounded-[10px] px-[11px] font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-colors hover:bg-lilac-soft'

export default function Dashboard() {
  const { data } = useApplication()
  const customer = useSession()?.customer
  const progress = getProgress(data)
  const live = progress.submitted && data.status && data.status !== 'draft' ? data.status : null
  const summary = data.summary ?? { label: 'Submitted', tone: 'progress' as const, step: 2 }
  const verify = summary.action === 'verify_identity'
  const percent = live ? Math.round((summary.step / TRACK_STAGE_COUNT) * 100) : progress.percent

  const journey = [
    { title: 'Complete your details', body: 'Your personal and employment information', done: progress.detailsComplete },
    { title: 'Submit your application', body: 'Review your information before sending', done: progress.submitted },
    { title: 'Track your progress', body: 'See updates and actions in one place', done: live === 'disbursed' },
  ]

  const details = progress.submitted
    ? [
        ['Application ID', data.reference ?? ''],
        ['Submitted', data.submittedAt ? formatDateTime(data.submittedAt) : ''],
        ['Status', summary.label],
      ]
    : [
        ['Application ID', data.reference ?? ''],
        ['Last saved', data.updatedAt ? formatDateTime(data.updatedAt) : 'Not saved yet'],
        ['Next step', progress.nextStepLabel],
      ]

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader
        eyebrow="Customer Dashboard"
        title={`Welcome back, ${customer ? firstNameOf(customer).toUpperCase() : ''}`}
        description={
          progress.started
            ? "Here's the latest on your Loan Application."
            : 'Start your loan application whenever you\'re ready.'
        }
      />

      <section
        className="anim-fade-up relative flex overflow-hidden rounded-[22px] border border-app-line bg-white px-5 pt-8 pb-7 shadow-[0_10px_30px_0_rgb(60_36_77/0.05)] sm:px-[37px] sm:pt-[51px] sm:pb-[37px]"
        style={delay(100)}
      >
        <div className={cn('flex min-w-0 flex-1 flex-col gap-[7px]', !progress.started && 'md:justify-center md:pb-6')}>
          {!progress.started ? (
            <>
              <StatusPill tone="progress" label="No application yet" pulse />
              <h2 className="pt-[6.25px] font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
                Apply for a loan
              </h2>
              <p className="max-w-[520px] font-inter text-[16px] leading-[24.8px] text-app-muted">
                You haven't started a loan application yet. It only takes a few guided steps, and your progress is
                saved as you go.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-[19px]">
                <Link to="/loan-packages" className={PRIMARY_LINK}>
                  Apply for Loan
                  <img src={iconChevronRight} alt="" className="block size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          ) : (
            <>
              {live ? (
                <StatusPill tone={summary.tone} label={summary.label} pulse={summary.tone === 'progress'} />
              ) : (
                <StatusPill tone="warning" label="Action Required" pulse />
              )}
              <h2 className="pt-[6.25px] font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
                {verify ? VERIFY_TITLE : live ? STATUS_TITLES[live] : 'Continue your application'}
              </h2>
              <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">
                {verify
                  ? VERIFY_MESSAGE
                  : live
                    ? STATUS_MESSAGES[live]
                  : `You've completed ${progress.completedSteps} of ${progress.totalSteps} steps. Your details are saved and waiting for you.`}
              </p>

              <div className="flex items-start justify-between pt-[19px] font-inter text-[14px] leading-[21.7px] text-app-ink">
                <span>{live ? 'Loan progress' : 'Application progress'}</span>
                <strong className="font-bold">{percent}%</strong>
              </div>
              <div
                className="h-2 overflow-hidden rounded-[8px] bg-track"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={live ? 'Loan progress' : 'Application progress'}
              >
                <div className="anim-grow-x h-full rounded-[8px] bg-lms-purple" style={{ width: `${percent}%` }} />
              </div>

              <dl className="grid grid-cols-1 gap-[18px] pt-[17px] sm:grid-cols-3">
                {details.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">{label}</dt>
                    <dd className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center gap-3 pt-[19px]">
                <Link to={verify ? '/verify-identity' : progress.nextStepPath} className={PRIMARY_LINK}>
                  {verify ? 'Verify My Identity' : progress.submitted ? 'Track My Application' : 'Continue Where You Left Off'}
                  <img src={iconChevronRight} alt="" className="block size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link to="/applications" className={SECONDARY_LINK}>
                  View Details
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="relative hidden h-[316.58px] w-[240px] shrink-0 md:block">
          <div className="absolute top-[-36px] right-[-36px] left-[30px] flex flex-col items-center bg-sky-soft py-[121.5px]">
            <div className="absolute top-[104.29px] left-[33px] size-[180px] rounded-[90px] border-[34px] border-lms-purple/5" />
            <div className="flex h-[145.565px] w-[117.176px] items-center justify-center">
              <div className="anim-float relative flex h-[140px] w-[110px] flex-col items-center gap-2.5 rounded-[12px] bg-white p-5 drop-shadow-[0_12px_19px_rgb(52_34_67/0.08)]">
                <img src={illusDocument} alt="" className="block h-[45.993px] w-[46.003px]" />
                <div className="h-[5px] w-[65px] rounded-[5px] bg-app-line" />
                <div className="h-[5px] w-11 rounded-[5px] bg-app-line" />
                {progress.started && (
                  <div className="anim-pop absolute -right-3 -bottom-3 flex size-[34px] items-center justify-center rounded-[17px] bg-lms-purple">
                    <img src={iconCheckWhite} alt="" className="block h-[19.997px] w-[20.008px]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="anim-fade-up flex flex-wrap items-end justify-between gap-2 pt-5" style={delay(200)}>
        <div className="flex flex-col gap-1">
          <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
            Your loan journey
          </h2>
          <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">Complete each stage at your own pace.</p>
        </div>
        <Link
          to="/history"
          className="font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple underline-offset-4 hover:underline"
        >
          View application history
        </Link>
      </div>

      <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {journey.map((step, index) => (
          <li
            key={step.title}
            className="anim-fade-up flex items-start gap-[14px] rounded-[14px] border border-app-line bg-white p-[23px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)]"
            style={delay(260 + index * 70)}
          >
            <span
              className={cn(
                'flex size-[34px] shrink-0 items-center justify-center rounded-[17px] font-inter text-[16px] leading-[24.8px] font-bold',
                step.done ? 'bg-lms-purple' : 'bg-app-bg text-app-muted',
              )}
            >
              {step.done ? <img src={iconCheckStep} alt="Done" className="block size-5" /> : index + 1}
            </span>
            <div className="flex min-w-0 flex-col gap-[3.5px]">
              <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{step.title}</p>
              <p className="font-inter text-[13px] leading-[20.15px] text-app-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section
        className="anim-fade-up flex flex-wrap items-center gap-[15px] rounded-[14px] bg-sky-soft px-6 pt-[26px] pb-5"
        style={delay(480)}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white">
          <img src={iconShield} alt="" className="block size-5" />
        </span>
        <div className="min-w-0 flex-1 text-sky-ink">
          <p className="font-inter text-[16px] leading-[24.8px] font-bold">Your information is safe with us</p>
          <p className="font-inter text-[13px] leading-[20.15px] opacity-80">
            We use secure systems and will never ask you to share your password or verification code.
          </p>
        </div>
        <a
          href="tel:8001301448"
          className="ml-auto flex min-h-[50px] items-center justify-center rounded-[10px] px-[11px] font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-colors hover:bg-white/70"
        >
          Get Help
        </a>
      </section>

      <PrototypeFlows />
    </div>
  )
}
