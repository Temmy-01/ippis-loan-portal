import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { AuthBackground } from '@/components/auth/AuthBackground'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import { TextField } from '@/components/ui/TextField'
import { formatTime, useCodeTimer } from '@/features/auth/useCodeTimer'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

const STRONG_PASSWORD = /^(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/

type Errors = Partial<Record<'code' | 'password' | 'confirm' | 'form', string>>

export default function ResetPassword() {
  const navigate = useNavigate()
  const email = (useLocation().state as { email?: string } | null)?.email
  const timer = useCodeTimer()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!email) return <Navigate to="/forgot-password" replace />

  const clear = (key: keyof Errors) => setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }))

  const handleResend = async () => {
    if (!timer.canResend) return
    setCode('')
    setErrors({})
    timer.restart()
    const result = await api('/portal/auth/forgot-password', { body: { email } })
    if (result.ok) setNotice('We have sent you a new code.')
    else setErrors({ form: result.message })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found: Errors = {}
    if (code.length < 6) found.code = 'Enter the 6-digit code we sent you'
    if (!STRONG_PASSWORD.test(password)) found.password = 'Use at least 8 characters, with a number and a symbol'
    if (!confirm || confirm !== password) found.confirm = 'Passwords do not match'
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    const result = await api('/portal/auth/reset-password', { body: { email, code, newPassword: password } })
    setSubmitting(false)

    if (result.ok) {
      navigate('/login', { replace: true, state: { notice: 'Password updated. Sign in with your new password.' } })
      return
    }
    if (/code/i.test(result.message)) setErrors({ code: result.message })
    else setErrors({ form: result.message })
  }

  return (
    <>
      <AuthBackground variant="light" />
      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="anim-card-in w-full max-w-[590px] rounded-[20px] bg-white px-5 pt-12 pb-[45px] shadow-[0_30px_80px_-30px_rgb(67_25_103/0.25)] sm:px-[25px]"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-poppins text-[28px] leading-[40px] font-semibold text-ink sm:text-[36px] sm:leading-[48px]">
              Reset your password
            </h1>
            <p className="font-poppins text-[16px] leading-[25px] text-ink-navy sm:text-[18px]">
              Enter the code we sent to your email and phone,
              <br className="hidden sm:inline" /> then choose a new password.
            </p>
          </div>

          <div className="mx-auto mt-[39px] w-full sm:w-[537px]">
            <div className="flex h-7 items-center justify-between font-inter text-[15px] text-slate">
              <span className="font-medium">Enter reset code</span>
              <span className="tracking-[-0.165px] tabular-nums" aria-live="polite">
                {timer.expired ? 'Code expired' : `Expires in ${formatTime(timer.secondsLeft)}`}
              </span>
            </div>
            <div className="mt-[3px] flex justify-center">
              <OtpInput
                value={code}
                onChange={(value) => {
                  setCode(value)
                  clear('code')
                }}
                error={Boolean(errors.code)}
                autoFocus
              />
            </div>
            {errors.code && (
              <p role="alert" className="anim-fade-in mt-2 font-poppins text-[12px] text-danger">
                {errors.code}
              </p>
            )}
            {notice && !errors.code && (
              <p role="status" className="anim-fade-in mt-2 font-poppins text-[12px] text-[#147a55]">
                {notice}
              </p>
            )}
            <button
              type="button"
              onClick={handleResend}
              disabled={!timer.canResend}
              className={cn(
                'mt-4 font-inter text-[14px] font-bold tracking-[-0.154px] text-indigo transition-opacity',
                timer.canResend ? 'hover:underline' : 'cursor-default opacity-40',
              )}
            >
              Resend reset code?
            </button>

            <div className="mt-6 flex flex-col gap-5 sm:px-[1px]">
              <TextField
                label="New password"
                type="password"
                name="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(value) => {
                  setPassword(value)
                  clear('password')
                }}
                error={errors.password}
                toggleClassName="right-1 text-lms-lilac"
              />
              <TextField
                label="Confirm new password"
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                value={confirm}
                onChange={(value) => {
                  setConfirm(value)
                  clear('confirm')
                }}
                error={errors.confirm}
                toggleClassName="right-1 text-lms-lilac"
              />
            </div>
          </div>

          {errors.form && (
            <p role="alert" className="anim-fade-in mt-5 rounded-[10px] bg-[#fdecec] px-3 py-2.5 font-poppins text-[13px] text-danger">
              {errors.form}
            </p>
          )}

          <Button type="submit" loading={submitting} className="mt-8">
            Reset Password
          </Button>

          <p className="mt-6 text-center font-inter text-[14px] leading-5 text-ink-icon">
            <Link to="/login" className="font-bold text-lms-purple underline underline-offset-2 hover:text-lms-dark-purple">
              Back to Sign in
            </Link>
          </p>
        </form>
      </main>
    </>
  )
}
