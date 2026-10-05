import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import iconChevronRight from '@/assets/app/icon-chevron-right.svg'
import iconShieldMuted from '@/assets/apply/icon-shield-muted.svg'
import infoBegin from '@/assets/apply/info-begin.svg'
import { LINK_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { InfoBox } from '@/components/apply/InfoBox'
import { APPLICATION_STEPS } from '@/features/application/steps'
import { cn } from '@/lib/cn'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function GetStarted() {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col">
      <Link
        to="/dashboard"
        className="anim-fade-in self-start font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-transform hover:-translate-x-0.5"
      >
        ← Return to Dashboard
      </Link>

      <div className="flex flex-col items-center px-0 pt-10 pb-[30px] text-center sm:px-[30px] sm:pt-[55px]">
        <span className="anim-fade-up flex min-h-7 items-center gap-[7px] rounded-[20px] bg-sky-soft px-2.5 py-1">
          <span className="size-[7px] rounded-full bg-sky-ink" />
          <span className="font-inter text-[12px] leading-[18.6px] font-bold text-sky-ink">Takes only a few guided steps</span>
        </span>
        <h1
          className="anim-fade-up font-inter text-[28px] leading-[36px] font-bold tracking-[-1.2px] text-app-ink sm:text-[36px] sm:leading-[43.2px]"
          style={delay(80)}
        >
          Let's get started with your IPPIS loan
        </h1>
        <p
          className="anim-fade-up max-w-[700px] pt-2 font-inter text-[16px] leading-[26.35px] text-app-muted sm:text-[17px]"
          style={delay(160)}
        >
          We'll guide you through a few simple steps to complete your application. You can save your progress and
          return whenever you're ready.
        </p>
      </div>

      <section
        className="anim-fade-up flex flex-col gap-[18px] rounded-[16px] border border-app-line bg-white px-5 py-8 sm:px-[29px] sm:py-[49px]"
        style={delay(220)}
      >
        <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
          What you'll complete
        </h2>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {APPLICATION_STEPS.map((step, index) => (
            <li
              key={step.slug}
              className="anim-fade-up flex h-[54px] items-center gap-2.5 rounded-[10px] bg-app-bg p-[13px] transition-colors duration-200 hover:bg-lilac-soft/60"
              style={delay(300 + index * 50)}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-[14px] bg-lilac-soft font-inter text-[13px] leading-[20.15px] font-bold text-lms-purple">
                {index + 1}
              </span>
              <span className="font-inter text-[13px] leading-[20.15px] font-bold text-app-ink">{step.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <InfoBox icon={infoBegin} iconWidth={14.58} title="Before you begin" className="anim-fade-up mt-4">
        Have your personal, employment and IPPIS information ready. Document requirements will be shown during the
        application and are configured by Dominion Merchant.
      </InfoBox>

      <p className="flex items-center gap-2.5 pt-[35px] pb-[25px] font-inter text-[14px] leading-[21.7px] text-app-muted">
        <img src={iconShieldMuted} alt="" className="block size-5 shrink-0" />
        Your progress is saved as you go, and your information is handled securely.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/apply/personal" className={cn(PRIMARY_BUTTON, 'group')}>
          Begin Application
          <img src={iconChevronRight} alt="" className="block size-5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <Link to="/dashboard" className={LINK_BUTTON}>
          Not now
        </Link>
      </div>
    </div>
  )
}
