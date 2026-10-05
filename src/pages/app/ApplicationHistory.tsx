import type { CSSProperties } from 'react'

import iconTimelineDone from '@/assets/app/icon-timeline-done.svg'
import iconTimelinePending from '@/assets/app/icon-timeline-pending.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { mockApplication, mockHistory } from '@/data/mockUser'
import { cn } from '@/lib/cn'

export default function ApplicationHistory() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Application History"
        title="Application History"
        description={`A record of updates for application ${mockApplication.id}.`}
      />

      <ol className="anim-fade-up rounded-[16px] border border-app-line bg-white py-[29px] pr-5 pl-10 sm:pr-[29px] sm:pl-14" style={{ '--delay': '80ms' } as CSSProperties}>
        {mockHistory.map((event, index) => {
          const last = index === mockHistory.length - 1
          return (
            <li
              key={event.title}
              className={cn('anim-fade-up relative border-l-2 pb-[30px] pl-8', last ? 'border-transparent' : 'border-app-line')}
              style={{ '--delay': `${160 + index * 90}ms` } as CSSProperties}
            >
              <span
                className={cn(
                  'absolute top-0 -left-4 flex size-[30px] items-center justify-center rounded-[15px] border-2 border-lms-purple',
                  event.done ? 'bg-lms-purple' : 'bg-white anim-pulse-ring-purple',
                )}
              >
                <img src={event.done ? iconTimelineDone : iconTimelinePending} alt="" className="block size-[15px]" />
              </span>
              <div className="flex flex-col gap-[3px]">
                <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{event.title}</p>
                <p className="font-inter text-[12.8px] leading-[19.84px] text-app-muted">{event.time}</p>
                <p className="pt-[5px] font-inter text-[16px] leading-[24.8px] text-app-muted">{event.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
