import type { CSSProperties } from 'react'
import { Navigate } from 'react-router-dom'

import iconTimelineDone from '@/assets/app/icon-timeline-done.svg'
import iconTimelinePending from '@/assets/app/icon-timeline-pending.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { useApplication } from '@/features/application/ApplicationContext'
import { isSubmitted } from '@/features/application/status'
import { useTimeline } from '@/features/application/useTimeline'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'

export default function ApplicationHistory() {
  const { data, loading } = useApplication()
  const { timeline, error } = useTimeline(isSubmitted(data.status) ? data.id : null)
  const history = timeline?.history ?? []

  if (loading) return null
  if (!isSubmitted(data.status)) return <Navigate to="/applications" replace />

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Application History"
        title="Application History"
        description={data.reference ? `A record of updates for application ${data.reference}.` : 'A record of updates for your application.'}
      />

      <ol className="anim-fade-up rounded-[16px] border border-app-line bg-white py-[29px] pr-5 pl-10 sm:pr-[29px] sm:pl-14" style={{ '--delay': '80ms' } as CSSProperties}>
        {error && <li className="font-inter text-[16px] text-app-muted">{error}</li>}
        {history.map((event, index) => {
          const last = index === history.length - 1
          const done = event.done
          return (
            <li
              key={`${event.title}-${event.at ?? 'waiting'}`}
              className={cn('anim-fade-up relative border-l-2 pb-[30px] pl-8', last ? 'border-transparent' : 'border-app-line')}
              style={{ '--delay': `${160 + index * 90}ms` } as CSSProperties}
            >
              <span
                className={cn(
                  'absolute top-0 -left-4 flex size-[30px] items-center justify-center rounded-[15px] border-2 border-lms-purple',
                  done ? 'bg-lms-purple' : 'bg-white',
                  !done && index === 0 && 'anim-pulse-ring-purple',
                )}
              >
                <img src={done ? iconTimelineDone : iconTimelinePending} alt="" className="block size-[15px]" />
              </span>
              <div className="flex flex-col gap-[3px]">
                <p className={cn('font-inter text-[16px] leading-[24.8px] font-bold', done ? 'text-app-ink' : 'text-lms-purple')}>{event.title}</p>
                <p className="font-inter text-[12.8px] leading-[19.84px] text-app-muted">
                  {event.at ? formatDateTime(event.at) : 'Waiting'}
                  {event.at && !done && ' · In progress'}
                </p>
                <p className="pt-[5px] font-inter text-[16px] leading-[24.8px] text-app-muted">{event.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
