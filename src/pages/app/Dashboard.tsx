import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import iconCheckStep from '@/assets/app/icon-check-step.svg'
import iconCheckWhite from '@/assets/app/icon-check-white.svg'
import iconChevronRight from '@/assets/app/icon-chevron-right.svg'
import iconShield from '@/assets/app/icon-shield.svg'
import illusDocument from '@/assets/app/illus-document.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { PrototypeFlows } from '@/components/app/PrototypeFlows'
import { mockApplication, mockUser } from '@/data/mockUser'
import { cn } from '@/lib/cn'

const JOURNEY = [
  { title: 'Complete your details', body: 'Your personal and employment information', done: true },
  { title: 'Submit your application', body: 'Review your information before sending', done: false },
  { title: 'Track your progress', body: 'See updates and actions in one place', done: false },
]

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function Dashboard() {
  const { id, completedSteps, totalSteps, lastSaved, nextStep } = mockApplication
  const progress = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader
        eyebrow="Customer Dashboard"
        title={`Welcome back, ${mockUser.firstName.toUpperCase()}`}
        description="Here's the latest on your IPPIS Loan Application."
      />

      <section
        className="anim-fade-up relative flex overflow-hidden rounded-[22px] border border-app-line bg-white px-5 pt-8 pb-7 shadow-[0_10px_30px_0_rgb(60_36_77/0.05)] sm:px-[37px] sm:pt-[51px] sm:pb-[37px]"
        style={delay(100)}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
          <span className="flex min-h-7 items-center gap-[7px] self-start rounded-[20px] bg-amber-soft px-2.5 py-1">
            <span className="size-[7px] animate-pulse rounded-full bg-amber" />
            <span className="font-inter text-[12px] leading-[18.6px] font-bold text-amber">Action Required</span>
          </span>
          <h2 className="pt-[6.25px] font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
            Continue your application
          </h2>
          <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">
            You've completed {completedSteps} of {totalSteps} steps. Your details are saved and waiting for you.
          </p>

          <div className="flex items-start justify-between pt-[19px] font-inter text-[14px] leading-[21.7px] text-app-ink">
            <span>Application progress</span>
            <strong className="font-bold">{progress}%</strong>
          </div>
          <div
            className="h-2 overflow-hidden rounded-[8px] bg-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Application progress"
          >
            <div className="anim-grow-x h-full rounded-[8px] bg-lms-purple" style={{ width: `${progress}%` }} />
          </div>

          <dl className="grid grid-cols-1 gap-[18px] pt-[17px] sm:grid-cols-3">
            {[
              ['Application ID', id],
              ['Last saved', lastSaved],
              ['Next step', nextStep],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">{label}</dt>
                <dd className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-3 pt-[19px]">
            <Link
              to="/apply/documents"
              className="group flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] bg-lms-purple px-[23px] py-3 font-inter text-[16px] leading-[24.8px] font-bold text-white shadow-[0_6px_7px_0_rgb(124_46_191/0.16)] transition-all duration-200 hover:-translate-y-px hover:bg-[#6c25a9] hover:shadow-[0_10px_20px_-6px_rgb(124_46_191/0.5)]"
            >
              Continue Where You Left Off
              <img
                src={iconChevronRight}
                alt=""
                className="block size-5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/applications"
              className="flex min-h-[50px] items-center justify-center rounded-[10px] px-[11px] font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-colors hover:bg-lilac-soft"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="relative hidden h-[316.58px] w-[240px] shrink-0 md:block">
          <div className="absolute top-[-36px] right-[-36px] left-[30px] flex flex-col items-center bg-sky-soft py-[121.5px]">
            <div className="absolute top-[104.29px] left-[33px] size-[180px] rounded-[90px] border-[34px] border-lms-purple/5" />
            <div className="flex h-[145.565px] w-[117.176px] items-center justify-center">
              <div className="anim-float relative flex h-[140px] w-[110px] flex-col items-center gap-2.5 rounded-[12px] bg-white p-5 drop-shadow-[0_12px_19px_rgb(52_34_67/0.08)]">
                <img src={illusDocument} alt="" className="block h-[45.993px] w-[46.003px]" />
                <div className="h-[5px] w-[65px] rounded-[5px] bg-app-line" />
                <div className="h-[5px] w-11 rounded-[5px] bg-app-line" />
                <div className="absolute -right-3 -bottom-3 flex size-[34px] items-center justify-center rounded-[17px] bg-lms-purple">
                  <img src={iconCheckWhite} alt="" className="block h-[19.997px] w-[20.008px]" />
                </div>
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
        {JOURNEY.map((step, index) => (
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
