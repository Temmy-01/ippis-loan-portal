import { useId, useState, type CSSProperties } from 'react'
import { LuShieldCheck, LuUser } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { LINK_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { Modal } from '@/components/ui/Modal'
import { LOAN_PACKAGES, getLoanPackage, type LoanPackage } from '@/data/loanPackages'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'

const ICONS = { ippis: LuShieldCheck, private: LuUser }

type CardProps = { item: LoanPackage; index: number; busy: boolean; current: boolean; onApply: () => void }

function PackageCard({ item, index, busy, current, onApply }: CardProps) {
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
        {current && (
          <span className="flex min-h-7 items-center gap-[7px] self-start rounded-[20px] bg-lilac-soft px-2.5 py-1">
            <span className="size-[7px] rounded-full bg-lms-purple" />
            <span className="font-inter text-[12px] leading-[18.6px] font-bold text-lms-purple">In progress</span>
          </span>
        )}
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
            {busy ? <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Starting" /> : current ? 'Continue Application' : 'Apply Now'}
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
  const titleId = useId()
  const { data, start, switchPackage } = useApplication()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [switchTo, setSwitchTo] = useState<LoanPackage | null>(null)
  const draftPackage = data.id && data.status === 'draft' ? data.loanPackage : null

  const run = async (item: LoanPackage, action: typeof start) => {
    setError('')
    setBusyId(item.id)
    const problem = await action(item.id)
    setBusyId(null)
    setSwitchTo(null)
    if (problem) setError(problem)
    else navigate('/apply')
  }

  const apply = (item: LoanPackage) => {
    if (draftPackage && draftPackage !== item.id) setSwitchTo(item)
    else run(item, start)
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
          <PackageCard
            key={item.id}
            item={item}
            index={index}
            busy={busyId === item.id}
            current={draftPackage === item.id}
            onApply={() => apply(item)}
          />
        ))}
      </div>

      <Modal open={switchTo !== null} onClose={() => !busyId && setSwitchTo(null)} labelledBy={titleId}>
        {switchTo && (
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <h2 id={titleId} className="font-poppins text-[22px] leading-[30px] font-semibold text-ink">
              Switch to {switchTo.shortName}?
            </h2>
            <div className="flex flex-col gap-3 font-inter text-[15px] leading-[23px] text-app-muted">
              <p>
                You already started a <span className="font-bold text-app-ink">{getLoanPackage(draftPackage).shortName}</span> application
                ({data.reference}). We can change it to a {switchTo.shortName} application instead.
              </p>
              <p>
                <span className="font-bold text-app-ink">We'll keep:</span> your personal details, loan amount, purpose and tenor, Valid ID
                and face check.
              </p>
              <p>
                <span className="font-bold text-app-ink">You'll fill in again:</span> the details and documents that only apply to{' '}
                {switchTo.shortName}. Your application will also get a new application ID.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" disabled={Boolean(busyId)} onClick={() => setSwitchTo(null)} className={LINK_BUTTON}>
                Keep {getLoanPackage(draftPackage).shortName}
              </button>
              <button type="button" disabled={Boolean(busyId)} onClick={() => run(switchTo, switchPackage)} className={PRIMARY_BUTTON}>
                {busyId ? (
                  <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Switching" />
                ) : (
                  `Switch to ${switchTo.shortName}`
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
