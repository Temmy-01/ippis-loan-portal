import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthBackground } from '@/components/auth/AuthBackground'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import { cn } from '@/lib/cn'
import { maskEmail } from '@/lib/validators'

const CODE_LENGTH = 6
const RESEND_AFTER_SECONDS = 90

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const maskedEmail = email ? maskEmail(email) : 'a••••@email.com'

  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(RESEND_AFTER_SECONDS)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const handleResend = () => {
    if (secondsLeft > 0) return
    // TODO: call the resend-code endpoint.
    setCode('')
    setError('')
    setSecondsLeft(RESEND_AFTER_SECONDS)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (code.length < CODE_LENGTH) {
      setError('Enter the 6-digit code we sent you')
      return
    }
    setSubmitting(true)
    // TODO: call the verify-code endpoint.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitting(false)
    navigate('/login')
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
              We've sent a verification code to {maskedEmail}.
              <br />
              Enter the code to confirm your details.
            </p>
          </div>

          <div className="mx-auto mt-[39px] w-full sm:w-[537px]">
            <div className="flex h-7 items-center justify-between font-inter text-[15px] text-slate">
              <span className="font-medium">Enter Verification code</span>
              <span className="tracking-[-0.165px] tabular-nums" aria-live="polite">
                {formatTime(secondsLeft)}
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

            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0}
              className={cn(
                'mt-[26px] font-inter text-[14px] font-bold tracking-[-0.154px] text-indigo transition-opacity',
                secondsLeft > 0 ? 'cursor-default' : 'hover:underline',
              )}
            >
              Resend Verification code?
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
