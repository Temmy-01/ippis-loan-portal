import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'purple' | 'lilac'
  loading?: boolean
}

const TONES = {
  purple: 'bg-lms-purple hover:bg-[#6c25a9] hover:shadow-[0_10px_24px_-10px_rgb(124_46_191/0.7)]',
  lilac: 'bg-lms-lilac hover:bg-[#bb66fb] hover:shadow-[0_10px_24px_-10px_rgb(200_125_254/0.9)]',
}

export function Button({ tone = 'purple', loading = false, disabled, className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        'relative flex h-12 w-full items-center justify-center rounded-[12px] font-poppins text-[14px] font-medium text-white',
        'transition-all duration-200 ease-out hover:-translate-y-px active:translate-y-0 active:scale-[0.99]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lms-lilac',
        'disabled:pointer-events-none disabled:opacity-70',
        TONES[tone],
        className,
      )}
    >
      {loading ? (
        <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Loading" />
      ) : (
        children
      )}
    </button>
  )
}
