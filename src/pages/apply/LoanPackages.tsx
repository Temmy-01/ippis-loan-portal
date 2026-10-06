import type { CSSProperties } from 'react'
import { LuShieldCheck, LuUser } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { LOAN_PACKAGES, type LoanPackage } from '@/data/loanPackages'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'

const ICONS = { ippis: LuShieldCheck, private: LuUser }

function PackageCard({ item, index, onApply }: { item: LoanPackage; index: number; onApply: () => void }) {
  const Icon = ICONS[item.id]
  return (
    <section
      className={cn(
        'anim-fade-up flex flex-col rounded-[18px] border border-app-line bg-white p-6 shadow-[0_10px_30px_0_rgb(60_36_77/0.05)] transition-all duration-300 sm:p-8',
        item.available && 'hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgb(60_36_77/0.12)]',
      )}
      style={{ '--delay': `${120 + index * 90}ms` } as CSSProperties}
    >
      <span
        className={cn(
          'flex size-[60px] items-center justify-center rounded-[16px]',
          item.available ? 'bg-lilac-soft text-lms-purple' : 'bg-sky-soft text-sky-ink',
        )}
      >
        <Icon className="size-6" />
      </span>

      <div className="mt-8 flex flex-col gap-2.5">
        {!item.available && (
          <span className="flex min-h-7 items-center gap-[7px] self-start rounded-[20px] bg-sky-soft px-2.5 py-1">
            <span className="size-[7px] rounded-full bg-sky-ink" />
            <span className="font-inter text-[12px] leading-[18.6px] font-bold text-sky-ink">Coming Soon</span>
          </span>
        )}
        <h2 className="font-inter text-[22px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink sm:text-[24px]">
          {item.name}
        </h2>
        <p className="max-w-[400px] font-inter text-[16px] leading-[25px] text-app-muted">{item.description}</p>
      </div>

      <div className="mt-auto pt-8">
        {item.available ? (
          <button type="button" onClick={onApply} className={cn(PRIMARY_BUTTON, 'w-full')}>
            Apply Now
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex min-h-[50px] w-full cursor-not-allowed items-center justify-center rounded-[10px] border border-app-line bg-white font-inter text-[16px] leading-[24.8px] font-bold text-lms-lilac"
          >
            Coming Soon
          </button>
        )}
      </div>
    </section>
  )
}

export default function LoanPackages() {
  const navigate = useNavigate()
  const { data, update, reset } = useApplication()

  const apply = (item: LoanPackage) => {
    if (data.submittedAt || (data.loanPackage && data.loanPackage !== item.id)) reset()
    update({ loanPackage: item.id })
    navigate('/apply')
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Loan Application" title="Choose a loan package" description="Select the option that applies to you to get started." />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LOAN_PACKAGES.map((item, index) => (
          <PackageCard key={item.id} item={item} index={index} onApply={() => apply(item)} />
        ))}
      </div>
    </div>
  )
}
