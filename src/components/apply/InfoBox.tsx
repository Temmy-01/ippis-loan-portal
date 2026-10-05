import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type InfoBoxProps = {
  icon: string
  iconWidth: number
  title?: string
  tone?: 'info' | 'warning'
  className?: string
  children: ReactNode
}

export function InfoBox({ icon, iconWidth, title, tone = 'info', className, children }: InfoBoxProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-[11px] rounded-[12px] px-4 py-[14px] font-inter text-[14px] leading-[21.7px]',
        tone === 'info' ? 'bg-sky-soft text-sky-ink' : 'bg-amber-soft text-amber',
        className,
      )}
    >
      <img src={icon} alt="" className="block h-5 shrink-0" style={{ width: iconWidth }} />
      <div className="min-w-0">
        {title && <p className="font-bold">{title}</p>}
        <p className={cn(title && 'font-normal')}>{children}</p>
      </div>
    </div>
  )
}
