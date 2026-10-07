import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LuLock, LuLogOut, LuUser } from 'react-icons/lu'
import { Link, useNavigate } from 'react-router-dom'

import iconBell from '@/assets/app/icon-bell.svg'
import iconChevronDown from '@/assets/app/icon-chevron-down.svg'
import { initialsOf, useSession } from '@/features/auth/session'
import { useNotifications } from '@/features/notifications/store'
import { cn } from '@/lib/cn'

type HeaderProps = {
  leading?: ReactNode
  onOpenMenu: () => void
  onLogout: () => void
}

export function Header({ leading, onOpenMenu, onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const customer = useSession()?.customer
  const unread = useNotifications().filter((n) => !n.readAt).length
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const menuItems = [
    { label: 'My Profile', icon: LuUser, action: () => navigate('/profile') },
    { label: 'Password', icon: LuLock, action: () => navigate('/profile?tab=security') },
    { label: 'Log Out', icon: LuLogOut, action: onLogout },
  ]

  return (
    <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between gap-4 border-b border-app-line bg-white/95 px-4 backdrop-blur sm:px-8 xl:px-[57.6px]">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex size-11 items-center justify-center rounded-full border border-app-line lg:hidden"
        >
          <span className="flex w-[18px] flex-col gap-[4px]">
            <span className="h-[2px] rounded bg-app-ink" />
            <span className="h-[2px] rounded bg-app-ink" />
            <span className="h-[2px] rounded bg-app-ink" />
          </span>
        </button>
        {leading && <div className="hidden min-w-0 sm:block">{leading}</div>}
      </div>

      <div className="flex items-center gap-[14px]">
        <Link
          to="/notifications"
          aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
          className="group relative flex size-11 items-center justify-center rounded-[22px] border border-app-line bg-white transition-colors hover:border-lms-lilac"
        >
          <img src={iconBell} alt="" className="block size-5 origin-top group-hover:animate-[wiggle_0.5s_ease-in-out]" />
          {unread > 0 && (
            <span className="anim-pop absolute -top-[3px] -right-[2px] flex size-[18px] items-center justify-center rounded-[9px] bg-lms-purple font-inter text-[10px] leading-[15.5px] text-white">
              {unread}
            </span>
          )}
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex min-h-[46px] items-center gap-[9px] rounded-full py-1 pr-1"
          >
            <span className="flex size-[38px] items-center justify-center rounded-[19px] bg-lilac-soft font-inter text-[13px] leading-[20.15px] font-bold text-lms-purple">
              {customer ? initialsOf(customer) : ''}
            </span>
            <span className="hidden font-inter text-[16px] leading-[24.8px] text-app-ink sm:inline">{customer?.fullName}</span>
            <img src={iconChevronDown} alt="" className={cn('block size-4 transition-transform duration-200', menuOpen && 'rotate-180')} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="anim-scale-in absolute top-[calc(100%+8px)] right-0 w-[198px] overflow-hidden rounded-[12px] border border-app-line bg-white p-2 shadow-[0_12px_38px_0_rgb(52_34_67/0.12)]"
              style={{ animationDuration: '0.2s' }}
            >
              {menuItems.map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    action()
                  }}
                  className="flex h-11 w-full items-center gap-3 rounded-[8px] px-3 text-left font-inter text-[16px] text-app-ink transition-colors hover:bg-app-bg"
                >
                  <Icon className="size-[18px] shrink-0 text-[#413e44]" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
