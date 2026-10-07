import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { AuthBackground } from '@/components/auth/AuthBackground'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import { type Customer, setSession, updateCustomer } from '@/features/auth/session'
import { formatTime, useCodeTimer } from '@/features/auth/useCodeTimer'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

const CODE_LENGTH = 6

type VerifyState = {
  mode: 'signup' | 'contact'
  email?: string
  maskedEmail?: string
  maskedPhone?: string
}

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as VerifyState | null
  const sentTo = state?.maskedEmail ?? state?.maskedPhone ?? 'your email and phone'

  const [code, setCode] = useState('')
  const timer = useCodeTimer()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!state?.mode || (state.mode === 'signup' && !state.email)) return <Navigate to="/signup" replace />

  const handleResend = async () => {
    if (!timer.canResend) return
    if (state.mode === 'contact') {
      navigate('/profile?tab=contact')
      return
    }
    setCode('')
    setError('')
    timer.restart()
    const result = await api('/portal/auth/resend-otp', { body: { email: state.email } })
    if (result.ok) setNotice('We have sent you a new code.')
    else setError(result.message)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (code.length < CODE_LENGTH) {
      setError('Enter the 6-digit code we sent you')
      return
    }
    setSubmitting(true)

    if (state.mode === 'signup') {
      const result = await api<{ token: string; customer: Customer }>('/portal/auth/verify-otp', {
        body: { email: state.email, code },
      })
      setSubmitting(false)
      if (result.ok && result.payload) {
        setSession(result.payload)
        navigate('/dashboard', { replace: true })
        return
      }
      setError(result.message)
      return
    }

    const result = await api<Customer>('/portal/auth/contact/verify', { body: { code }, auth: true })
    setSubmitting(false)
    if (result.ok && result.payload) {
      updateCustomer(result.payload)
      navigate('/profile', { replace: true })
      return
    }
    if (result.status === 401) {
      navigate('/login', { replace: true })
      return
    }
    setError(result.message)
  }

  return (
    <>
      <AuthBackground variant="light" />

      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="anim-card-in w-full max-w-[590px] translate-y-[14px] rounded-[20px] bg-white px-5 pt-12 pb-[45px] shadow-[0_30px_80px_-30px_rgb(67_25_103/0.25)] sm:px-[25px]"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-poppins text-[28px] leading-[40px] font-semibold text-ink sm:text-[36px] sm:leading-[48px]">
              Verify your contact details
            </h1>
            <p className="font-poppins text-[16px] leading-[25px] text-ink-navy sm:text-[18px]">
              We've sent a verification code to {sentTo}.
              <br />
              Enter the code to confirm your details.
            </p>
          </div>

          <div className="mx-auto mt-[39px] w-full sm:w-[537px]">
            <div className="flex h-7 items-center justify-between font-inter text-[15px] text-slate">
              <span className="font-medium">Enter Verification code</span>
              <span className="tracking-[-0.165px] tabular-nums" aria-live="polite">
                {timer.expired ? 'Code expired' : `Expires in ${formatTime(timer.secondsLeft)}`}
              </span>
            </div>

            <div className="mt-[3px] flex justify-center">
              <OtpInput
                value={code}
                onChange={(value) => {
                  setCode(value)
                  if (error) setError('')
                }}
                length={CODE_LENGTH}
                error={Boolean(error)}
                autoFocus
              />
            </div>

            {error && (
              <p role="alert" className="anim-fade-in mt-2 font-poppins text-[12px] text-danger">
                {error}
              </p>
            )}
            {notice && !error && (
              <p role="status" className="anim-fade-in mt-2 font-poppins text-[12px] text-[#147a55]">
                {notice}
              </p>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={!timer.canResend}
              className={cn(
                'mt-[26px] font-inter text-[14px] font-bold tracking-[-0.154px] text-indigo transition-opacity',
                timer.canResend ? 'hover:underline' : 'cursor-default opacity-40',
              )}
            >
              {state.mode === 'contact' ? 'Request a new code' : 'Resend Verification code?'}
            </button>
          </div>

          <Button type="submit" loading={submitting} className="mt-10">
            Verify Contact Details
          </Button>
        </form>
      </main>
    </>
  )
}
