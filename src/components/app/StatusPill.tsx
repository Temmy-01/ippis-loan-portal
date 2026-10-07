import { TONE_STYLES, type StatusTone } from '@/features/application/status'
import { cn } from '@/lib/cn'

export function StatusPill({ tone, label, pulse = false }: { tone: StatusTone; label: string; pulse?: boolean }) {
  return (
    <span className={cn('flex min-h-7 items-center gap-[7px] self-start rounded-[20px] px-2.5 py-1', TONE_STYLES[tone].pill)}>
      <span className={cn('size-[7px] rounded-full', TONE_STYLES[tone].dot, pulse && 'animate-pulse')} />
      <span className="font-inter text-[12px] leading-[18.6px] font-bold">{label}</span>
    </span>
  )
}
