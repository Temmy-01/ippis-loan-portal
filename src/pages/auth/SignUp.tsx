import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import iconCursor from '@/assets/auth/icon-cursor.svg'
import iconHeadset from '@/assets/auth/icon-headset.svg'
import iconRocket from '@/assets/auth/icon-rocket.svg'
import iconShield from '@/assets/auth/icon-shield.svg'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Logo } from '@/components/ui/Logo'
import { TextField } from '@/components/ui/TextField'
import { isEmail, isPhone, toPhoneDigits } from '@/lib/validators'

const FEATURES = [
  {
    icon: iconShield,
    title: 'Simple & Secure',
    body: 'A straightforward digital loan application designed with your convenience and security in mind.',
  },
  {
    icon: iconRocket,
    title: 'Apply at Your Own Pace',
    body: 'Start your application, save your progress, and continue whenever it is convenient for you.',
  },
  {
    icon: iconCursor,
    title: 'Track Your Application',
    body: 'Stay informed as your application moves from submission through review and decision.',
  },
  {
    icon: iconHeadset,
    title: 'Support When You Need It',
    body: 'Get helpful guidance throughout your application and access support.',
  },
]

type Field = 'fullName' | 'email' | 'phone' | 'password' | 'confirmPassword'
type Errors = Partial<Record<Field | 'terms', string>>

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Record<Field, string>>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [agreed, setAgreed] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const update = (field: Field) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Errors = {}
    if (form.fullName.trim().split(/\s+/).length < 2) nextErrors.fullName = 'Enter your first and last name'
    if (!isEmail(form.email)) nextErrors.email = 'Enter a valid email address'
    if (!isPhone(form.phone)) nextErrors.phone = 'Enter an 11-digit phone number, e.g. 08012345678'
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match'
    if (!agreed) nextErrors.terms = 'Please accept the terms to continue'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    // TODO: call the sign-up endpoint, which sends the verification code.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitting(false)
    navigate('/verify', { state: { email: form.email.trim() } })
  }

  return (
    <>
      <AuthBackground variant="light" />

      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8 xl:py-12">
        <div className="flex w-full max-w-[590px] flex-col items-center gap-12 xl:w-auto xl:max-w-none xl:flex-row xl:gap-[100px]">
          <section className="flex w-full flex-col gap-[35px] xl:w-[500px]">
            <div className="anim-fade-up" style={delay(100)}>
              <Logo tone="color" />
            </div>

            <div className="flex flex-col gap-[25px]">
              <h1
                className="anim-fade-up font-poppins text-[34px] leading-[44px] font-semibold text-lms-dark-purple sm:text-[48px] sm:leading-[58px]"
                style={delay(180)}
              >
                Apply for Your IPPIS Loan, Easily.
              </h1>
              <p className="anim-fade-up font-poppins text-[16px] leading-6 text-ink" style={delay(260)}>
                Complete your loan application securely, at your own pace. Save your progress and return whenever
                you're ready.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-[50px] gap-y-6 sm:grid-cols-[210px_210px]">
              {FEATURES.map((feature, index) => (
                <li
                  key={feature.title}
                  className="anim-fade-up group flex flex-col sm:h-[140px] sm:pt-[5.87px]"
                  style={delay(340 + index * 80)}
                >
                  <img
                    src={feature.icon}
                    alt=""
                    className="block size-6 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
                  />
                  <p className="mt-3 font-poppins text-[14px] font-medium text-ink sm:mt-[29px]">{feature.title}</p>
                  <p className="mt-[3px] font-poppins text-[12px] leading-[17px] text-ink-muted">{feature.body}</p>
                </li>
              ))}
            </ul>

            <div className="anim-fade-up font-poppins text-[14px]" style={delay(700)}>
              <p className="leading-6 text-ink-soft">Prefer to speak with someone?</p>
              <p className="font-semibold text-ink">
                Call us at{' '}
                <a href="tel:8001301448" className="transition-colors hover:text-lms-purple">
                  800 1301 448
                </a>
              </p>
            </div>
          </section>

          <section
            className="anim-card-in w-full rounded-[32px] bg-white px-6 py-12 shadow-[0_30px_80px_-30px_rgb(67_25_103/0.25)] sm:px-[83px] sm:py-[79px] xl:w-[590px]"
            style={delay(80)}
          >
            <h2 className="font-poppins text-[30px] leading-[40px] font-semibold text-ink sm:text-[36px] sm:leading-[48px]">
              Create your account
            </h2>
            <p className="mt-[5px] font-poppins text-[14px] font-medium text-ink">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-lms-lilac underline decoration-from-font underline-offset-2 transition-colors hover:text-lms-purple"
              >
                Sign In
              </Link>
            </p>

            <form noValidate onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
              <div className="flex flex-col gap-[30px]">
                <TextField
                  label="Full name"
                  placeholder="Enter Full name"
                  name="name"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={update('fullName')}
                  error={errors.fullName}
                  heightClassName="h-[49px]"
                />
                <TextField
                  label="Email address"
                  placeholder="Enter Email address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  error={errors.email}
                  heightClassName="h-[49px]"
                />
                <TextField
                  label="Phone number"
                  placeholder="Enter Phone number"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={form.phone}
                  onChange={(value) => update('phone')(toPhoneDigits(value))}
                  error={errors.phone}
                  heightClassName="h-[49px]"
                />
                <TextField
                  label="Password"
                  type="password"
                  name="new-password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update('password')}
                  error={errors.password}
                  toggleClassName="right-1 text-lms-lilac"
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  error={errors.confirmPassword}
                  toggleClassName="right-1 text-lms-lilac"
                />
                <Button type="submit" loading={submitting}>
                  Sign Up
                </Button>
              </div>

              <div>
                <Checkbox
                  checked={agreed}
                  onChange={(checked) => {
                    setAgreed(checked)
                    if (checked) setErrors((prev) => ({ ...prev, terms: undefined }))
                  }}
                  error={Boolean(errors.terms)}
                >
                  <span className="font-poppins text-[12px] leading-[17px] text-ink-muted">
                    I agree to the{' '}
                    <a href="#" className="font-semibold text-lms-purple hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-semibold text-lms-purple hover:underline">
                      Privacy Policy.
                    </a>
                  </span>
                </Checkbox>
                {errors.terms && (
                  <p role="alert" className="anim-fade-in mt-1 font-poppins text-[12px] text-danger">
                    {errors.terms}
                  </p>
                )}
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}
