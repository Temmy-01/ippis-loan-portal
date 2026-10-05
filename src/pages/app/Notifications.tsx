import type { CSSProperties } from 'react'
import { LuChevronRight, LuFileText, LuShieldCheck, LuUser } from 'react-icons/lu'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/app/PageHeader'
import { Logo } from '@/components/ui/Logo'
import { mockApplication, mockUser } from '@/data/mockUser'
import { markAllRead, markRead, useNotifications, type NotificationKind } from '@/features/notifications/store'
import { cn } from '@/lib/cn'

const ICONS: Record<NotificationKind, typeof LuUser> = {
  verification: LuShieldCheck,
  application: LuFileText,
  account: LuUser,
}

export default function Notifications() {
  const notifications = useNotifications()
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader eyebrow="Notifications" title="Notifications" description="Updates about your account and loan application." />
        <button
          type="button"
          onClick={markAllRead}
          disabled={!hasUnread}
          className="mt-6 font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-opacity hover:underline disabled:opacity-40 disabled:hover:no-underline"
        >
          Mark all as read
        </button>
      </div>

      <ul className="-mt-1 flex flex-col gap-3">
        {notifications.map((n, index) => {
          const Icon = ICONS[n.kind]
          return (
            <li key={n.id} className="anim-fade-up" style={{ '--delay': `${80 + index * 70}ms` } as CSSProperties}>
              <Link
                to={n.to}
                onClick={() => markRead(n.id)}
                className="group relative flex items-center gap-[15px] rounded-[14px] border border-app-line bg-white py-[18px] pr-5 pl-[19px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_0_rgb(60_36_77/0.06)] sm:pr-7"
              >
                <span
                  className={cn(
                    'absolute inset-y-[18px] left-0 w-1 rounded-r-full bg-lms-purple transition-transform duration-300 origin-left',
                    n.read ? 'scale-x-0' : 'scale-x-100',
                  )}
                />
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lilac-soft">
                  <Icon className="size-5 text-lms-purple" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-inter text-[13px] leading-[20px] font-semibold text-lms-purple">
                    {n.category}
                    {!n.read && ' · New'}
                  </p>
                  <p className={cn('font-inter text-[16px] leading-[22px] text-app-ink', n.read ? 'font-semibold' : 'font-bold')}>
                    {n.title}
                  </p>
                  <p className="font-inter text-[14px] leading-[20px] text-app-muted">{n.body}</p>
                  <p className="font-inter text-[14px] leading-[20px] text-app-muted">{n.date}</p>
                </div>
                <LuChevronRight className="size-5 shrink-0 text-app-ink transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </li>
          )
        })}
      </ul>

      <section
        className="anim-fade-up -mt-1 grid grid-cols-1 items-center gap-8 rounded-[16px] border border-app-line bg-white p-5 sm:p-[29px] lg:grid-cols-[minmax(0,1fr)_minmax(0,515px)] lg:gap-10"
        style={{ '--delay': '320ms' } as CSSProperties}
      >
        <div>
          <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
            Customer email templates
          </h2>
          <p className="mt-2 font-inter text-[17px] leading-[25px] text-app-muted">
            Branded email previews are prepared for account, application, verification, decision, offer and
            disbursement updates.
          </p>
        </div>

        <div className="rounded-[12px] border border-app-line bg-white p-[22px]">
          <Logo tone="color" width={117} height={27} className="object-left" />
          <p className="mt-3 font-inter text-[11px] leading-[17px] text-app-ink">SUBJECT: Your application update</p>
          <p className="mt-3 font-inter text-[13px] leading-[20px] font-bold text-app-ink">Hello {mockUser.firstName},</p>
          <p className="mt-2 font-inter text-[13px] leading-[20px] text-app-muted">
            There is an update to application {mockApplication.id}. Sign in securely to view it.
          </p>
          <Link
            to="/track"
            className="mt-3 inline-flex h-[38px] items-center rounded-[6px] bg-lms-purple px-3.5 font-inter text-[13px] font-bold text-white transition-colors hover:bg-[#6c25a9]"
          >
            View Application
          </Link>
          <p className="mt-3 font-inter text-[11px] leading-[17px] text-app-ink">
            Support details are populated from approved business information.
          </p>
        </div>
      </section>
    </div>
  )
}
