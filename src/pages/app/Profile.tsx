import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { LuLogOut } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { Field, TextInput } from '@/components/apply/FormField'
import { fullName, initials, mockUser } from '@/data/mockUser'
import { cn } from '@/lib/cn'
import { isEmail, isPhone, maskEmail, toPhoneDigits } from '@/lib/validators'

const TABS = [
  { id: 'details', label: 'Profile Details' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'security', label: 'Password & Security' },
] as const

type TabId = (typeof TABS)[number]['id']

const maskPhone = (phone: string) => `${phone.slice(0, 3)} •••• ${phone.slice(-4)}`
const STRONG_PASSWORD = /^(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="anim-fade-up max-w-[850px] rounded-[16px] border border-app-line bg-white p-5 sm:p-[29px]">
      {children}
    </section>
  )
}

function ProfileDetails() {
  const details = [
    { label: 'Full name', value: fullName },
    { label: 'Registered email', value: maskEmail(mockUser.email) },
    { label: 'Phone number', value: maskPhone(mockUser.phone) },
  ]
  return (
    <Card>
      <div className="flex items-center gap-[18px] pb-7">
        <span className="anim-pop flex size-[72px] shrink-0 items-center justify-center rounded-full bg-lilac-soft font-inter text-[23px] font-bold text-lms-purple">
          {initials}
        </span>
        <div>
          <p className="font-inter text-[24px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink">{fullName}</p>
          <p className="mt-1 font-inter text-[16px] leading-[24.8px] text-app-muted">Customer since {mockUser.customerSince}</p>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-5 border-t border-app-line pt-7 sm:grid-cols-3">
        {details.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="font-inter text-[13px] leading-[20.15px] text-app-muted">{label}</dt>
            <dd className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

function ContactInformation() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ email?: string; phone?: string; form?: string }>({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (email && !isEmail(email)) next.email = 'Enter a valid email address'
    if (phone && !isPhone(phone)) next.phone = 'Enter an 11-digit phone number, e.g. 08012345678'
    if (!email && !phone) next.form = 'Enter a new email address or phone number'
    setErrors(next)
    if (Object.keys(next).length) return
    setSaving(true)
    // TODO: call the update-contact endpoint, which sends a verification code.
    await new Promise((resolve) => setTimeout(resolve, 900))
    navigate('/verify', { state: { email: email || mockUser.email, returnTo: '/profile?tab=contact' } })
  }

  return (
    <Card>
      <form noValidate onSubmit={handleSubmit}>
        <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
          Update contact information
        </h2>
        <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">
          For your security, updated details must be verified before they take effect.
        </p>
        <div className="mt-1 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Email address" error={errors.email}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} type="email" autoComplete="email" aria-describedby={describedBy} invalid={invalid} placeholder="ada@example.com" value={email} onValueChange={(value) => { setEmail(value); setErrors({}) }} />
            )}
          </Field>
          <Field label="Phone number" error={errors.phone}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} type="tel" inputMode="numeric" maxLength={11} autoComplete="tel" aria-describedby={describedBy} invalid={invalid} placeholder="080 1234 5678" value={phone} onValueChange={(value) => { setPhone(toPhoneDigits(value)); setErrors({}) }} />
            )}
          </Field>
        </div>
        {errors.form && (
          <p role="alert" className="anim-fade-in mt-3 font-inter text-[13px] text-danger">
            {errors.form}
          </p>
        )}
        <button type="submit" disabled={saving} className={cn(PRIMARY_BUTTON, 'mt-5')}>
          {saving ? <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Saving" /> : 'Save and Verify Changes'}
        </button>
      </form>
    </Card>
  )
}

function PasswordSecurity() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (!current) found.current = 'Enter your current password'
    if (!STRONG_PASSWORD.test(next)) found.next = 'Use at least 8 characters, with a number and a symbol'
    if (confirm !== next || !confirm) found.confirm = 'Passwords do not match'
    setErrors(found)
    if (Object.keys(found).length) return
    setStatus('saving')
    // TODO: call the change-password endpoint.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setStatus('saved')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  const clear = (key: keyof typeof errors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (status === 'saved') setStatus('idle')
  }

  return (
    <Card>
      <form noValidate onSubmit={handleSubmit} className="flex max-w-[500px] flex-col gap-6">
        <h2 className="-mb-3 font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">Change password</h2>
        <Field label="Current password" error={errors.current}>
          {({ id, describedBy, invalid }) => (
            <TextInput id={id} type="password" autoComplete="current-password" aria-describedby={describedBy} invalid={invalid} value={current} onValueChange={(value) => { setCurrent(value); clear('current') }} />
          )}
        </Field>
        <Field label="New password" hint="At least 8 characters, with a number and a symbol" error={errors.next}>
          {({ id, describedBy, invalid }) => (
            <TextInput id={id} type="password" autoComplete="new-password" aria-describedby={describedBy} invalid={invalid} value={next} onValueChange={(value) => { setNext(value); clear('next') }} />
          )}
        </Field>
        <Field label="Confirm new password" error={errors.confirm}>
          {({ id, describedBy, invalid }) => (
            <TextInput id={id} type="password" autoComplete="new-password" aria-describedby={describedBy} invalid={invalid} value={confirm} onValueChange={(value) => { setConfirm(value); clear('confirm') }} />
          )}
        </Field>
        <button type="submit" disabled={status === 'saving'} className={cn(PRIMARY_BUTTON, '-mt-1 w-full')}>
          {status === 'saving' ? (
            <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Saving" />
          ) : status === 'saved' ? (
            'Password updated'
          ) : (
            'Save Changes'
          )}
        </button>
      </form>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-app-line pt-6">
        <div>
          <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">Log out of your account</p>
          <p className="font-inter text-[16px] leading-[24.8px] font-medium text-app-muted">
            Your saved application progress will remain available.
          </p>
        </div>
        <button type="button" onClick={() => navigate('/login')} className={cn(OUTLINE_BUTTON, 'gap-2')}>
          <LuLogOut className="size-5" />
          Log Out
        </button>
      </div>
    </Card>
  )
}

export default function Profile() {
  const [params, setParams] = useSearchParams()
  const active = (TABS.find((tab) => tab.id === params.get('tab'))?.id ?? 'details') as TabId

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Account Settings" title="My Profile" description="Manage your details and account security." />

      <div className="mt-1 flex flex-col gap-5">
        <div
          role="tablist"
          aria-label="Profile sections"
          className="anim-fade-up flex gap-2 overflow-x-auto border-b border-app-line"
          style={{ '--delay': '80ms' } as CSSProperties}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setParams(tab.id === 'details' ? {} : { tab: tab.id }, { replace: true })}
              className={cn(
                'shrink-0 rounded-t-[8px] px-4 py-3 font-inter text-[16px] leading-[20px] font-medium whitespace-nowrap transition-colors duration-200',
                active === tab.id ? 'bg-white text-lms-purple' : 'text-app-muted hover:text-app-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={active}>
          {active === 'details' && <ProfileDetails />}
          {active === 'contact' && <ContactInformation />}
          {active === 'security' && <PasswordSecurity />}
        </div>
      </div>
    </div>
  )
}
