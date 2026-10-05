import { useId, useRef, useState, type InputHTMLAttributes } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

import { cn } from '@/lib/cn'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  heightClassName?: string
  toggleClassName?: string
}

export function TextField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  heightClassName = 'h-12',
  toggleClassName,
  className,
  id,
  ...inputProps
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const isPassword = type === 'password'
  const raised = focused || value.length > 0 || Boolean(placeholder)
  const active = raised && !error

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn('relative w-full cursor-text', heightClassName, error && 'anim-shake')}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault()
            inputRef.current?.focus()
          }
        }}
      >
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-0 origin-left font-poppins whitespace-nowrap text-ink-muted',
            'transition-all duration-200 ease-out',
            raised ? 'top-0 text-[12px] leading-[17px]' : 'top-[calc(50%-10px)] text-[14px] leading-[21px]',
          )}
        >
          {label}
        </label>

        <input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={(event) => {
            setFocused(true)
            inputProps.onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            inputProps.onBlur?.(event)
          }}
          className={cn(
            'absolute top-[calc(50%-4px)] left-0 h-[21px] w-full bg-transparent font-poppins text-[14px] leading-[21px] font-medium text-ink outline-none',
            'placeholder:text-ink',
            isPassword && 'pr-8',
            !raised && 'opacity-0',
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((shown) => !shown)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className={cn(
              'absolute top-1/2 right-[14px] flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-ink-icon',
              'transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-lms-lilac',
              toggleClassName,
            )}
          >
            {revealed ? <FaEye className="size-[15px]" /> : <FaEyeSlash className="size-[15px]" />}
          </button>
        )}

        <span className="absolute inset-x-0 bottom-0 h-px bg-line" />
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-300 ease-out',
            error ? 'scale-x-100 bg-danger' : 'bg-lms-lilac',
            !error && (active ? 'scale-x-100' : 'scale-x-0'),
          )}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="anim-fade-in mt-1.5 font-poppins text-[12px] leading-[17px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
