import { useId, useState, type FormEvent } from 'react'
import { FaEyeSlash } from 'react-icons/fa6'

import iconEye from '@/assets/app/icon-eye.svg'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
}

const STRONG_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

function PasswordBox({
  label,
  value,
  onChange,
  error,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: boolean
  autoComplete: string
}) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="w-full">
      <label htmlFor={id} className="block pl-[31.7px] font-inter text-[14px] leading-[22px] font-semibold text-ink-navy">
        {label}
      </label>
      <div
        className={cn(
          'relative mx-[7.2px] mt-2 h-[55px] rounded-[7px] border bg-field shadow-[inset_0_3px_6px_0_rgb(0_0_0/0.02)] transition-[border-color,box-shadow] duration-200',
          'focus-within:border-lms-lilac focus-within:shadow-[0_0_0_4px_rgb(200_125_254/0.12)]',
          error ? 'anim-shake border-danger' : 'border-field',
        )}
      >
        <input
          id={id}
          type={revealed ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          placeholder="*********"
          onChange={(event) => onChange(event.target.value)}
          className="h-full w-full bg-transparent pr-14 pl-[24.5px] font-inter text-[14px] leading-[22px] tracking-[0.056px] text-field-ink outline-none placeholder:text-field-ink"
        />
        <button
          type="button"
          onClick={() => setRevealed((shown) => !shown)}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-[27.4px] flex h-6 w-6 -translate-y-1/2 items-center justify-center transition-transform hover:scale-110"
        >
          {revealed ? (
            <FaEyeSlash className="size-[17px] text-periwinkle" />
          ) : (
            <img src={iconEye} alt="" className="block h-[14px] w-[19.13px]" />
          )}
        </button>
      </div>
    </div>
  )
}

export function ChangePasswordModal({ open, onClose }: Props) {
  const titleId = useId()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [error, setError] = useState<'current' | 'next' | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const close = () => {
    onClose()
    setCurrent('')
    setNext('')
    setError(null)
    setSaved(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!current) return setError('current')
    if (!STRONG_PASSWORD.test(next)) return setError('next')
    setError(null)
    setSaving(true)
    // TODO: call the change-password endpoint.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(close, 1200)
  }

  return (
    <Modal open={open} onClose={close} labelledBy={titleId} className="sm:min-h-[541px]">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-[37.75px] px-4 py-10 sm:min-h-[541px] sm:justify-center sm:px-[25px]"
      >
        <h2 id={titleId} className="w-full text-center font-poppins text-[26px] leading-[48px] font-semibold text-lms-dark-purple sm:text-[30px]">
          Change Password
        </h2>

        <div className="w-full">
          <PasswordBox
            label="Password"
            value={current}
            onChange={(value) => {
              setCurrent(value)
              if (error === 'current') setError(null)
            }}
            error={error === 'current'}
            autoComplete="current-password"
          />
          <p className={cn('mt-[7px] px-[25.5px] font-inter text-[12px]', error === 'current' ? 'text-danger' : 'text-[#667085]')}>
            {error === 'current' ? (
              'Enter your current password'
            ) : (
              <>
                <span className="font-black text-periwinkle">Note:</span> Your password must be at least 8 characters
                long, containing a mix of <span className="font-semibold">letters, numbers, and special symbols.</span>
              </>
            )}
          </p>

          <div className="mt-[39px]">
            <PasswordBox
              label="Change Password"
              value={next}
              onChange={(value) => {
                setNext(value)
                if (error === 'next') setError(null)
              }}
              error={error === 'next'}
              autoComplete="new-password"
            />
            {error === 'next' && (
              <p role="alert" className="anim-fade-in mt-[7px] px-[25.5px] font-inter text-[12px] text-danger">
                Use 8 or more characters with letters, numbers and a special symbol.
              </p>
            )}
          </div>
        </div>

        <Button type="submit" loading={saving} disabled={saved}>
          {saved ? 'Password updated' : 'Save Changes'}
        </Button>
      </form>
    </Modal>
  )
}
