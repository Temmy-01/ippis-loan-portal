import { useId, useState } from 'react'
import { LuBuilding2, LuCheck, LuLock } from 'react-icons/lu'

import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { Modal } from '@/components/ui/Modal'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepNav } from '@/features/application/useStepNav'
import { cn } from '@/lib/cn'

const TEST_BANKS = ['Access Bank', 'GTBank', 'First Bank', 'UBA', 'Zenith Bank', 'Kuda']

export default function BankStep() {
  const titleId = useId()
  const { goNext } = useStepNav('bank')
  const { data, linkBank } = useApplication()
  const [open, setOpen] = useState(false)
  const [bank, setBank] = useState<string | null>(null)
  const [linking, setLinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async (mismatch = false) => {
    setLinking(true)
    setError(null)
    const result = await linkBank({ mismatch })
    setLinking(false)
    setOpen(false)
    setBank(null)
    if (!result.ok) setError(result.message)
  }

  const handleContinue = () => {
    if (!data.kyc?.verified) {
      setError('Please verify your BVN on the Identity step first.')
      return
    }
    if (!data.bank) {
      setError('Link your bank account to continue.')
      return
    }
    goNext()
  }

  return (
    <StepPage slug="bank" onContinue={handleContinue}>
      <StepCard className="sm:pb-[51px]">
        {data.bank ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#bfe7d3] bg-[#f2fbf6] p-5">
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#17724d] text-white">
                <LuCheck className="size-6" strokeWidth={3} />
              </span>
              <div>
                <p className="font-inter text-[16px] font-bold text-app-ink">{data.bank.accountName}</p>
                <p className="font-inter text-[14px] text-app-muted">
                  {data.bank.bankName} · {data.bank.accountNumber}
                </p>
                <p className="font-inter text-[12px] text-[#17724d]">Linked and matches your BVN name</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="font-inter text-[15px] font-bold text-lms-purple hover:underline">
              Link a different account
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <ul className="flex flex-col gap-2 font-inter text-[14px] leading-[21px] text-app-muted">
              <li className="flex gap-2">
                <LuLock className="mt-0.5 size-4 shrink-0 text-lms-purple" /> You log in on Mono's secure screen. We never see your banking password.
              </li>
              <li className="flex gap-2">
                <LuLock className="mt-0.5 size-4 shrink-0 text-lms-purple" /> We only read your account name, balance and transactions to assess your loan.
              </li>
              <li className="flex gap-2">
                <LuLock className="mt-0.5 size-4 shrink-0 text-lms-purple" /> The account must be in the same name as your BVN.
              </li>
            </ul>
            <button type="button" onClick={() => setOpen(true)} className={cn(PRIMARY_BUTTON, 'gap-2')}>
              <LuBuilding2 className="size-5" /> Link Bank Account
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-[12px] bg-[#fdeced] px-4 py-3 font-inter text-[14px] text-[#b4282d]">
            {error}
          </p>
        )}
      </StepCard>

      <Modal open={open} onClose={() => !linking && setOpen(false)} labelledBy={titleId}>
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="font-inter text-[12px] font-bold tracking-wide text-amber">TEST MODE · SIMULATED MONO</p>
            <h2 id={titleId} className="mt-1 font-poppins text-[22px] leading-[30px] font-semibold text-ink">
              Select your bank
            </h2>
            {/* <p className="font-inter text-[14px] text-app-muted">In live mode, this is Mono's secure window where you log in to your bank.</p> */}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TEST_BANKS.map((name) => (
              <button
                key={name}
                type="button"
                disabled={linking}
                onClick={() => setBank(name)}
                className={cn(
                  'rounded-[10px] border px-3 py-3 text-left font-inter text-[14px] font-bold transition-colors',
                  bank === name ? 'border-lms-purple bg-lilac-soft/50 text-lms-purple' : 'border-app-line text-app-ink hover:bg-app-bg',
                )}
              >
                {name}
              </button>
            ))}
          </div>
          <button type="button" disabled={!bank || linking} onClick={() => connect()} className={cn(PRIMARY_BUTTON, 'justify-center disabled:opacity-50')}>
            {linking ? <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Connecting" /> : 'Connect Securely'}
          </button>
          {import.meta.env.DEV && (
            <button type="button" disabled={linking} onClick={() => connect(true)} className="font-inter text-[13px] text-app-muted underline">
              Test: link an account in someone else's name
            </button>
          )}
        </div>
      </Modal>
    </StepPage>
  )
}
