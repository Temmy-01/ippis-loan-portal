import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

import { cn } from '@/lib/cn'

type OtpInputProps = {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: boolean
  autoFocus?: boolean
}

export function OtpInput({ value, onChange, length = 6, error, autoFocus }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, index) => value[index] ?? '')

  const focusBox = (index: number) => {
    const box = refs.current[Math.max(0, Math.min(length - 1, index))]
    box?.focus()
    box?.select()
  }

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join('').slice(0, length))
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (/^\d$/.test(event.key)) {
      event.preventDefault()
      setDigit(index, event.key)
      focusBox(index + 1)
    } else if (event.key === 'Backspace') {
      event.preventDefault()
      if (digits[index]) setDigit(index, '')
      else if (index > 0) {
        setDigit(index - 1, '')
        focusBox(index - 1)
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusBox(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusBox(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    focusBox(pasted.length)
  }

  return (
    <div className={cn('flex w-full justify-between gap-2 sm:w-auto sm:justify-center sm:gap-5', error && 'anim-shake')}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          onFocus={(event) => event.target.select()}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onChange={(event) => {
            const typed = event.target.value.replace(/\D/g, '').slice(-1)
            if (!typed) return
            setDigit(index, typed)
            focusBox(index + 1)
          }}
          className={cn(
            'h-[56px] w-full min-w-0 rounded-[8px] border border-solid bg-white text-center font-poppins text-[22px] font-semibold text-ink outline-none sm:w-[70px]',
            'transition-[border-color,box-shadow,transform] duration-200 ease-out',
            'focus:-translate-y-0.5 focus:border-lms-lilac focus:shadow-[0_0_0_4px_rgb(200_125_254/0.15)]',
            error ? 'border-danger' : digit ? 'border-lms-lilac' : 'border-[#cfc9d4] bg-[#fdfcfe]',
          )}
        />
      ))}
    </div>
  )
}
