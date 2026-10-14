import { useState } from 'react'
import { LuBriefcase, LuCar, LuCheck, LuUsers } from 'react-icons/lu'

import { StepCard, StepPage } from '@/components/apply/StepPage'
import { PRIVATE_PRODUCTS } from '@/data/applicationOptions'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepNav } from '@/features/application/useStepNav'
import { cn } from '@/lib/cn'

const ICONS: Record<string, typeof LuBriefcase> = { '302': LuBriefcase, '303': LuCar, '305': LuUsers }

export default function LoanTypeStep() {
  const { goNext } = useStepNav('loantype')
  const { data, update } = useApplication()
  const [error, setError] = useState<string | null>(null)

  const handleContinue = () => {
    if (!data.productCode) {
      setError('Choose a loan type to continue')
      return
    }
    goNext()
  }

  return (
    <StepPage slug="loantype" onContinue={handleContinue}>
      <StepCard>
        <div role="radiogroup" aria-label="Loan type" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRIVATE_PRODUCTS.map((product) => {
            const Icon = ICONS[product.code] ?? LuBriefcase
            const selected = data.productCode === product.code
            return (
              <button
                key={product.code}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  update({ productCode: product.code })
                  setError(null)
                }}
                className={cn(
                  'relative flex flex-col items-start gap-3 rounded-[14px] border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)]',
                  selected ? 'border-lms-purple bg-lilac-soft/40 ring-2 ring-lms-purple/20' : 'border-app-line bg-white',
                )}
              >
                <span className={cn('flex size-11 items-center justify-center rounded-full', selected ? 'bg-lms-purple text-white' : 'bg-lilac-soft text-lms-purple')}>
                  <Icon className="size-5" />
                </span>
                <span className="font-inter text-[17px] leading-[24px] font-bold text-app-ink">{product.name}</span>
                <span className="font-inter text-[14px] leading-[21px] text-app-muted">{product.description}</span>
                {selected && (
                  <span className="anim-pop absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-lms-purple text-white">
                    <LuCheck className="size-4" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {error && (
          <p role="alert" className="mt-4 font-inter text-[14px] text-danger">
            {error}
          </p>
        )}
      </StepCard>
    </StepPage>
  )
}
