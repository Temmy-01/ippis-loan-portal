import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import checkedIcon from '@/assets/auth/checkbox-checked.svg'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
  error?: boolean
}

export function Checkbox({ checked, onChange, children, error }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-[11px] py-[5px]">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-6 w-[22.897px] shrink-0 rounded-[3px] peer-focus-visible:outline-2 peer-focus-visible:outline-lms-lilac">
        {checked ? (
          <img src={checkedIcon} alt="" className="anim-pop absolute inset-0 block size-full" />
        ) : (
          <span
            className={cn(
              'absolute top-[3px] left-[2.86px] h-[18px] w-[17.17px] rounded-[2px] border-2 transition-colors',
              error ? 'anim-shake border-danger' : 'border-lms-lilac',
            )}
          />
        )}
      </span>
      {children}
    </label>
  )
}
