import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { LuLogOut } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { Field, TextInput } from '@/components/apply/FormField'
import { type Customer, clearSession, getSession, initialsOf, setSession, useSession } from '@/features/auth/session'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'

const TABS = [
  { id: 'details', label: 'Profile Details' },
  { id: 'security', label: 'Password & Security' },
] as const

type TabId = (typeof TABS)[number]['id']

const STRONG_PASSWORD = /^(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="anim-fade-up max-w-[850px] rounded-[16px] border border-app-line bg-white p-5 sm:p-[29px]">
      {children}
    </section>
  )
}

function ProfileDetails({ customer }: { customer: Customer }) {
  const details = [
    { label: 'Full name', value: customer.fullName },
    { label: 'Registered email', value: customer.email },
    { label: 'Phone number', value: customer.phone },
  ]
  return (
    <Card>
      <div className="flex items-center gap-[18px] pb-7">
        <span className="anim-pop flex size-[72px] shrink-0 items-center justify-center rounded-full bg-lilac-soft font-inter text-[23px] font-bold text-lms-purple">
          {initialsOf(customer)}
        </span>
        <div>
          <p className="font-inter text-[24px] leading-[31.2px] font-bold tracking-[-0.5px] text-app-ink">{customer.fullName}</p>
          <p className="mt-1 font-inter text-[16px] leading-[24.8px] text-app-muted">
            Customer since {formatDate(customer.customerSince.slice(0, 10))}
          </p>
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
    const result = await api<{ token: string }>('/portal/auth/change-password', {
      body: { currentPassword: current, newPassword: next },
      auth: true,
    })
    const session = getSession()

    if (result.ok && result.payload?.token && session) {
      setSession({ ...session, token: result.payload.token })
      setStatus('saved')
      setCurrent('')
      setNext('')
      setConfirm('')
      return
    }
    setStatus('idle')
    if (result.status === 401) return navigate('/login')
    if (/current password/i.test(result.message)) setErrors({ current: result.message })
    else setErrors({ next: result.message })
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
        <button
          type="button"
          onClick={() => {
            clearSession()
            navigate('/login')
          }}
          className={cn(OUTLINE_BUTTON, 'gap-2')}
        >
          <LuLogOut className="size-5" />
          Log Out
        </button>
      </div>
    </Card>
  )
}

export default function Profile() {
  const session = useSession()
  const [params, setParams] = useSearchParams()
  const active = (TABS.find((tab) => tab.id === params.get('tab'))?.id ?? 'details') as TabId

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Account" title="My Profile" description="Manage your details and account security." />

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
          {active === 'details' && session && <ProfileDetails customer={session.customer} />}
          {active === 'security' && <PasswordSecurity />}
        </div>
      </div>
    </div>
  )
}
