import { useEffect, useState } from 'react'
import { LuCheck } from 'react-icons/lu'

import { Field, TextInput } from '@/components/apply/FormField'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'
import { isPhone } from '@/lib/validators'

const HINT = 'Use your BVN or employment phone number.'
const RESEND_SECONDS = 60

const SMALL_BUTTON =
  'flex min-h-[52px] shrink-0 items-center justify-center rounded-[10px] bg-lms-purple px-5 font-inter text-[15px] font-bold text-white transition-colors hover:bg-lms-dark-purple disabled:opacity-50'

type Props = { value: string; error?: string; onChange: (value: string) => void }

export function PhoneVerify({ value, error, onChange }: Props) {
  const { data, sendPhoneCode, confirmPhoneCode } = useApplication()
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)
  const [wait, setWait] = useState(0)

  const verified = Boolean(data.verifiedPhone) && data.verifiedPhone === value
  const waitingForCode = codeSentTo === value && !verified

  useEffect(() => {
    if (wait <= 0) return
    const timer = setTimeout(() => setWait((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [wait])

  const send = async () => {
    if (!isPhone(value)) {
      setMessage({ text: 'Enter an 11-digit phone number, e.g. 08012345678', error: true })
      return
    }
    setBusy(true)
    setMessage(null)
    const result = await sendPhoneCode(value)
    setBusy(false)
    setMessage({ text: result.message, error: !result.ok })
    if (result.ok) {
      setCodeSentTo(value)
      setCode('')
      setWait(RESEND_SECONDS)
    }
  }

  const confirm = async () => {
    if (!/^\d{6}$/.test(code)) {
      setMessage({ text: 'Enter the 6-digit code we sent you', error: true })
      return
    }
    setBusy(true)
    const result = await confirmPhoneCode(code)
    setBusy(false)
    setMessage(result.ok ? null : { text: result.message, error: true })
    if (result.ok) setCodeSentTo(null)
  }

  const shownError = error ?? (message?.error ? message.text : undefined)

  return (
    <div className="flex flex-col gap-3">
      <Field label="Phone number" hint={verified ? undefined : (message?.text ?? HINT)} error={shownError}>
        {({ id, describedBy, invalid }) => (
          <div className="flex gap-2">
            <TextInput
              id={id}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              aria-describedby={describedBy}
              invalid={invalid}
              placeholder="08012345678"
              value={value}
              onValueChange={(next) => {
                onChange(next.replace(/\D/g, '').slice(0, 11))
                setMessage(null)
              }}
            />
            {verified ? (
              <span className="flex min-h-[52px] shrink-0 items-center gap-1.5 rounded-[10px] bg-[#e7f6ef] px-4 font-inter text-[15px] font-bold text-[#147a55]">
                <LuCheck className="size-4" strokeWidth={3} /> Verified
              </span>
            ) : (
              <button type="button" onClick={send} disabled={busy || (waitingForCode && wait > 0)} className={SMALL_BUTTON}>
                {waitingForCode ? (wait > 0 ? `Resend (${wait}s)` : 'Resend') : 'Verify'}
              </button>
            )}
          </div>
        )}
      </Field>

      {waitingForCode && (
        <div className="anim-fade-in flex gap-2">
          <TextInput
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label="Verification code"
            placeholder="6-digit code"
            maxLength={6}
            value={code}
            onValueChange={(next) => setCode(next.replace(/\D/g, '').slice(0, 6))}
          />
          <button type="button" onClick={confirm} disabled={busy} className={cn(SMALL_BUTTON)}>
            {busy ? <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Checking" /> : 'Confirm'}
          </button>
        </div>
      )}
    </div>
  )
}
