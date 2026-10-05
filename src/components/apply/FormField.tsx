import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

const CONTROL =
  'min-h-[52px] w-full rounded-[10px] border bg-white font-inter text-[16px] leading-[19.5px] text-app-ink outline-none ' +
  'transition-[border-color,box-shadow] duration-200 hover:border-[#c4bfc9] ' +
  'focus:border-lms-lilac focus:shadow-[0_0_0_4px_rgb(200_125_254/0.15)]'

type FieldProps = {
  label: string
  hint?: string
  error?: string
  className?: string
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={cn('flex flex-col gap-[7px]', className)}>
      <label htmlFor={id} className="font-inter text-[15px] leading-[23.25px] font-semibold text-app-ink">
        {label}
      </label>
      {children({ id, describedBy: message ? messageId : undefined, invalid: Boolean(error) })}
      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn(
            'font-inter text-[13px] leading-[20.15px]',
            error ? 'anim-fade-in text-danger' : '-mt-[0.7px] text-app-muted',
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onValueChange: (value: string) => void
  invalid?: boolean
}

export function TextInput({ onValueChange, invalid, className, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        CONTROL,
        'px-[15px] placeholder:text-[#9a959f]',
        invalid ? 'anim-shake border-danger' : 'border-[#d9d5dc]',
        className,
      )}
    />
  )
}

type SelectInputProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  options: readonly string[]
  placeholder: string
  onValueChange: (value: string) => void
  invalid?: boolean
}

export function SelectInput({ options, placeholder, onValueChange, invalid, className, ...props }: SelectInputProps) {
  return (
    <div className="relative">
      <select
        {...props}
        aria-invalid={invalid}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(
          CONTROL,
          'cursor-pointer appearance-none pr-[31px] pl-[19px]',
          invalid ? 'anim-shake border-danger' : 'border-[#d9d5dc]',
          className,
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-[14px] size-4 -translate-y-1/2 text-app-muted"
      >
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
