import { Link } from 'react-router-dom'

import iconStepDone from '@/assets/apply/icon-step-done.svg'
import { APPLICATION_STEPS } from '@/features/application/steps'
import { cn } from '@/lib/cn'

export function Stepper({ current }: { current: number }) {
  return (
    <nav aria-label="Application progress" className="w-full max-w-[1100px] px-4 py-7 sm:px-5">
      <ol className="flex justify-center">
        {APPLICATION_STEPS.map((step, index) => {
          const done = index < current
          const active = index === current
          const reached = done || active

          const circle = (
            <span
              className={cn(
                'relative z-[1] flex size-[30px] shrink-0 items-center justify-center rounded-[15px] border font-inter text-[12px] leading-[18.6px] transition-colors duration-300',
                reached ? 'border-lms-purple bg-lms-purple text-white' : 'border-[#cfc9d2] bg-app-bg text-[#a09aa5]',
                active && 'shadow-[0_0_0_4px_rgb(124_46_191/0.12)]',
              )}
            >
              {done ? <img src={iconStepDone} alt="" className="anim-pop block size-4" /> : index + 1}
            </span>
          )

          return (
            <li
              key={step.slug}
              aria-current={active ? 'step' : undefined}
              className="relative flex min-w-0 flex-1 items-start gap-[9px] lg:max-w-[185px] lg:flex-none lg:basis-[176.66px]"
            >
              {done ? (
                <Link to={`/apply/${step.slug}`} aria-label={`Go back to ${step.label}`} className="rounded-full transition-transform hover:scale-110">
                  {circle}
                </Link>
              ) : (
                circle
              )}

              {index < APPLICATION_STEPS.length - 1 && (
                <span className="absolute top-[15px] right-1 left-9 h-px bg-[#d9d4dc]">
                  <span
                    className={cn(
                      'block h-full origin-left bg-lms-purple/40 transition-transform duration-500 ease-out',
                      done ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </span>
              )}

              <span className={cn('hidden flex-col lg:flex', reached ? 'text-lms-purple' : 'text-[#a09aa5]')}>
                <span className="font-inter text-[10px] leading-[15.5px]">Step {index + 1}</span>
                <span className="font-inter text-[11px] leading-[17px] font-bold whitespace-nowrap">{step.label}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
