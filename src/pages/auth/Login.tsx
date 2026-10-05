import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import avatars from '@/assets/auth/avatars.svg'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { TextField } from '@/components/ui/TextField'
import { isEmail } from '@/lib/validators'

type Errors = Partial<Record<'email' | 'password', string>>

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Errors = {}
    if (!isEmail(email)) nextErrors.email = 'Enter a valid email address'
    if (!password) nextErrors.password = 'Enter your password'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    // TODO: call the login endpoint.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitting(false)
    navigate('/dashboard')
  }

  return (
    <>
      <AuthBackground variant="dark" />

      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8 xl:py-12">
        <div className="flex w-full max-w-[590px] flex-col-reverse items-center gap-12 xl:w-auto xl:max-w-none xl:flex-row xl:gap-[100px]">
          <section className="anim-card-in w-full rounded-[32px] bg-white px-6 py-12 shadow-[0_30px_80px_-30px_rgb(20_5_40/0.45)] sm:px-[77px] sm:py-[114px] xl:w-[590px]">
            <h1 className="font-poppins text-[30px] leading-[40px] font-semibold text-ink sm:text-[36px] sm:leading-[48px]">Sign in</h1>
            <p className="mt-[7px] font-poppins text-[14px] font-medium text-ink">Enter your valid credentials</p>

            <form noValidate onSubmit={handleSubmit} className="mt-[39px] flex flex-col gap-5">
              <TextField
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(value) => {
                  setEmail(value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                error={errors.email}
                heightClassName="h-14"
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(value) => {
                  setPassword(value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                error={errors.password}
              />

              <Button type="submit" tone="lilac" loading={submitting}>
                Sign In
              </Button>

              <p className="text-center font-inter text-[14px] leading-5 text-ink-icon">
                New to Dominion Merchant?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-lms-lilac underline decoration-from-font underline-offset-2 transition-colors hover:text-lms-purple"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </section>

          <section className="flex w-full flex-col gap-[35px] text-white xl:w-[500px]">
            <div className="anim-fade-up" style={delay(150)}>
              <Logo tone="white" />
            </div>

            <div className="flex flex-col gap-[25px]">
              <h2
                className="anim-fade-up font-poppins text-[34px] leading-[44px] font-semibold sm:text-[48px] sm:leading-[58px]"
                style={delay(250)}
              >
                Your loan journey,
                <br />
                made simpler.
              </h2>
              <p className="anim-fade-up font-poppins text-[16px] leading-6 opacity-[0.72]" style={delay(350)}>
                Start, save and track your application securely from one <br className="hidden sm:inline" />
                easy-to-use portal.
              </p>
            </div>

            <div className="anim-fade-up flex items-center gap-[15px]" style={delay(450)}>
              <img src={avatars} alt="" className="block h-9 w-[94px] shrink-0" />
              <p className="font-poppins text-[14px] font-medium">3k+ people joined us, now it’s your turn</p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
