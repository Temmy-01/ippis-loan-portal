import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { AuthBackground } from '@/components/auth/AuthBackground'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useSession } from '@/features/auth/session'
import { api } from '@/lib/api'
import { isEmail } from '@/lib/validators'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const session = useSession()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isEmail(email)) {
      setError('Enter a valid email address')
      return
    }
    setFormError('')
    setSubmitting(true)
    const cleanEmail = email.trim().toLowerCase()
    const result = await api('/portal/auth/forgot-password', { body: { email: cleanEmail } })
    setSubmitting(false)

    if (result.ok) {
      navigate('/reset-password', { state: { email: cleanEmail } })
      return
    }
    setFormError(result.message)
  }

  return (
    <>
      <AuthBackground variant="light" />
      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="anim-card-in w-full max-w-[590px] rounded-[20px] bg-white px-6 pt-12 pb-[45px] shadow-[0_30px_80px_-30px_rgb(67_25_103/0.25)] sm:px-[50px]"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-poppins text-[28px] leading-[40px] font-semibold text-ink sm:text-[36px] sm:leading-[48px]">
              Forgot your password?
            </h1>
            <p className="font-poppins text-[16px] leading-[25px] text-ink-navy">
              Enter the email address on your account. We'll send a reset code to your email and phone.
            </p>
          </div>

          <div className="mt-10">
            <TextField
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(value) => {
                setEmail(value)
                setError('')
              }}
              error={error}
              heightClassName="h-14"
            />
          </div>

          {formError && (
            <p role="alert" className="anim-fade-in mt-5 rounded-[10px] bg-[#fdecec] px-3 py-2.5 font-poppins text-[13px] text-danger">
              {formError}
            </p>
          )}

          <Button type="submit" loading={submitting} className="mt-8">
            Send Reset Code
          </Button>

          <p className="mt-6 text-center font-inter text-[14px] leading-5 text-ink-icon">
            Remembered it?{' '}
            <Link to="/login" className="font-bold text-lms-purple underline underline-offset-2 hover:text-lms-dark-purple">
              Back to Sign in
            </Link>
          </p>
        </form>
      </main>
    </>
  )
}
