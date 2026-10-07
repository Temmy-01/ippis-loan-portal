import { useState, type CSSProperties } from 'react'
import { LuShieldCheck, LuUser } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { LOAN_PACKAGES, type LoanPackage } from '@/data/loanPackages'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'

const ICONS = { ippis: LuShieldCheck, private: LuUser }

function PackageCard({ item, index, busy, onApply }: { item: LoanPackage; index: number; busy: boolean; onApply: () => void }) {
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
          <button type="button" onClick={onApply} disabled={busy} className={cn(PRIMARY_BUTTON, 'w-full')}>
            {busy ? <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Starting" /> : 'Apply Now'}
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
  const { start } = useApplication()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const apply = async (item: LoanPackage) => {
    setError('')
    setBusyId(item.id)
    const problem = await start(item.id)
    setBusyId(null)
    if (problem) setError(problem)
    else navigate('/apply')
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Loan Application" title="Choose a loan package" description="Select the option that applies to you to get started." />
      {error && (
        <p role="alert" className="anim-fade-in -mt-3 rounded-[10px] bg-[#fdecec] px-3 py-2.5 font-inter text-[14px] text-danger">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LOAN_PACKAGES.map((item, index) => (
          <PackageCard key={item.id} item={item} index={index} busy={busyId === item.id} onApply={() => apply(item)} />
        ))}
      </div>
    </div>
  )
}
