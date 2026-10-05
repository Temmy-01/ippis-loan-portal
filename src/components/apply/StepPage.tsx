import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import iconChevronRight from '@/assets/app/icon-chevron-right.svg'
import iconSave from '@/assets/apply/icon-save.svg'
import { ApplyLayout } from '@/components/apply/ApplyLayout'
import { LINK_BUTTON, OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { APPLICATION_STEPS } from '@/features/application/steps'
import { cn } from '@/lib/cn'

type StepPageProps = {
  index: number
  children: ReactNode
  onContinue: () => void
  submit?: { label: string; enabled: boolean; loading: boolean }
}

export function StepPage({ index, children, onContinue, submit }: StepPageProps) {
  const navigate = useNavigate()
  const step = APPLICATION_STEPS[index]
  const isFirst = index === 0

  const saveAndExit = (
    <button type="button" onClick={() => navigate('/dashboard')} className={LINK_BUTTON}>
      <img src={iconSave} alt="" className="block size-5" />
      Save &amp; Exit
    </button>
  )

  return (
    <ApplyLayout current={index}>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onContinue()
        }}
        className="flex w-full max-w-[900px] flex-col gap-6 px-4 pt-6 pb-[70px] sm:px-[25px]"
      >
        <div key={step.slug} className="anim-fade-up flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-inter text-[12px] leading-[18.6px] font-extrabold tracking-[1.2px] text-lms-purple">
              STEP {index + 1} OF {APPLICATION_STEPS.length}
            </p>
            <h1 className="pt-[1.25px] font-inter text-[28px] leading-[36px] font-bold tracking-[-1.2px] text-app-ink sm:text-[36px] sm:leading-[43.2px]">
              {step.title}
            </h1>
            <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">{step.description}</p>
          </div>
          <a
            href="tel:8001301448"
            className="shrink-0 font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple hover:underline"
          >
            Need help?
          </a>
        </div>

        <div key={`${step.slug}-body`} className="anim-fade-up" style={{ ['--delay' as string]: '80ms' }}>
          {children}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-app-line pt-[25px]">
          {submit ? (
            <>
              {saveAndExit}
              <button type="submit" disabled={!submit.enabled || submit.loading} className={cn(PRIMARY_BUTTON, !submit.enabled && 'opacity-45')}>
                {submit.loading ? (
                  <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Submitting" />
                ) : (
                  submit.label
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={isFirst}
                onClick={() => navigate(`/apply/${APPLICATION_STEPS[index - 1]?.slug}`)}
                className={cn(OUTLINE_BUTTON, isFirst && 'pointer-events-none opacity-45')}
              >
                Back
              </button>
              <div className="flex items-start gap-[10px]">
                {saveAndExit}
                <button type="submit" className={cn(PRIMARY_BUTTON, 'group')}>
                  Continue
                  <img src={iconChevronRight} alt="" className="block size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </ApplyLayout>
  )
}

export function StepCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-[280px] rounded-[16px] border border-app-line bg-white p-5 sm:p-[31px]', className)}>
      {children}
    </div>
  )
}
