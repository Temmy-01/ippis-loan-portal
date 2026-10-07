import type { CSSProperties } from 'react'
import { LuBell, LuChevronRight, LuFileText, LuShieldCheck, LuUser } from 'react-icons/lu'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { markAllRead, markRead, useNotifications, type NotificationKind } from '@/features/notifications/store'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'

const KINDS: Record<NotificationKind, { icon: typeof LuUser; category: string }> = {
  verification: { icon: LuShieldCheck, category: 'Security' },
  application: { icon: LuFileText, category: 'Application update' },
  account: { icon: LuUser, category: 'Account' },
}

export default function Notifications() {
  const notifications = useNotifications()
  const hasUnread = notifications.some((n) => !n.readAt)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader eyebrow="Notifications" title="Notifications" description="Updates about your account and loan application." />
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={!hasUnread}
            className="mt-6 font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-opacity hover:underline disabled:opacity-40 disabled:hover:no-underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <section className="anim-fade-up -mt-1 flex items-center gap-[15px] rounded-[16px] border border-dashed border-[#d9d5dc] px-5 py-6 sm:px-7">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
            <LuBell className="size-5 text-app-muted" />
          </span>
          <div>
            <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">No notifications yet</p>
            <p className="font-inter text-[13px] leading-[20.15px] text-app-muted">
              Updates about your account and application will appear here.
            </p>
          </div>
        </section>
      ) : (
        <ul className="-mt-1 flex flex-col gap-3">
          {notifications.map((n, index) => {
            const { icon: Icon, category } = KINDS[n.kind] ?? KINDS.account
            const unread = !n.readAt
            return (
              <li key={n.id} className="anim-fade-up" style={{ '--delay': `${80 + Math.min(index, 8) * 60}ms` } as CSSProperties}>
                <Link
                  to={n.link}
                  onClick={() => unread && markRead(n.id)}
                  className="group relative flex items-center gap-[15px] rounded-[14px] border border-app-line bg-white py-[18px] pr-5 pl-[19px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)] sm:pr-7"
                >
                  <span
                    className={cn(
                      'absolute inset-y-[18px] left-0 w-1 origin-left rounded-r-full bg-lms-purple transition-transform duration-300',
                      unread ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lilac-soft">
                    <Icon className="size-5 text-lms-purple" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-inter text-[13px] leading-[20px] font-semibold text-lms-purple">
                      {category}
                      {unread && ' · New'}
                    </p>
                    <p className={cn('font-inter text-[16px] leading-[22px] text-app-ink', unread ? 'font-bold' : 'font-semibold')}>
                      {n.title}
                    </p>
                    <p className="font-inter text-[14px] leading-[20px] text-app-muted">{n.body}</p>
                    <p className="font-inter text-[14px] leading-[20px] text-app-muted">{formatDateTime(n.createdAt)}</p>
                  </div>
                  <LuChevronRight className="size-5 shrink-0 text-app-ink transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
