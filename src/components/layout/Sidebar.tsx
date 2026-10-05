import { NavLink } from 'react-router-dom'

import helpSymbol from '@/assets/app/help-symbol.svg'
import navApplications from '@/assets/app/nav-applications.svg'
import navDashboard from '@/assets/app/nav-dashboard.svg'
import navHistory from '@/assets/app/nav-history.svg'
import navLogout from '@/assets/app/nav-logout.svg'
import navSettings from '@/assets/app/nav-settings.svg'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: navDashboard, iconClassName: 'left-[14px] size-6' },
  { to: '/applications', label: 'My Applications', icon: navApplications, iconClassName: 'left-[14px] size-[19px]' },
  { to: '/history', label: 'Application History', icon: navHistory, iconClassName: 'left-[14px] size-[19px]' },
  { to: '/settings', label: 'Settings', icon: navSettings, iconClassName: 'left-[16px] size-[14.5px]' },
]

type SidebarProps = {
  onNavigate?: () => void
  onLogout: () => void
}

export function Sidebar({ onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="flex h-full w-[270px] flex-col gap-2.5 border-r border-app-line bg-white py-7 pr-[19px] pl-[18px]">
      <div className="h-[52px] w-[190px] px-3">
        <Logo tone="color" width={166} height={31} />
      </div>

      <nav className="flex w-[233px] flex-col gap-1.5" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative block h-[50px] rounded-[10px] transition-colors duration-200',
                isActive ? 'bg-lilac-soft' : 'hover:bg-app-bg',
              )
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={item.icon}
                  alt=""
                  className={cn(
                    'absolute top-1/2 block -translate-y-1/2 transition-transform duration-200 group-hover:scale-110',
                    item.iconClassName,
                  )}
                />
                <span
                  className={cn(
                    'absolute top-[calc(50%+0.5px)] left-[45px] -translate-y-1/2 font-poppins text-[14px] leading-[24.8px] font-medium tracking-[-0.2px] whitespace-nowrap transition-colors',
                    isActive ? 'text-lms-purple' : 'text-nav',
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    'absolute top-1/2 right-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-lms-purple transition-all duration-300',
                    isActive ? 'opacity-100' : 'scale-y-0 opacity-0',
                  )}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="min-h-[93px] flex-1" />

      <div className="relative flex h-[190px] w-[209.576px] shrink-0 flex-col justify-end gap-[23.03px] overflow-hidden rounded-[18.424px] bg-lms-blue px-[18.424px] py-[23.03px]">
        <img
          src={helpSymbol}
          alt=""
          className="anim-drift absolute top-[-19.35px] left-[150.85px] block size-[74.848px]"
          style={{ animationDuration: '10s' }}
        />
        <div className="relative font-poppins text-[11.515px] leading-[1.3] text-lms-dark-purple">
          <p className="font-semibold">Need help with your application?</p>
          <p className="mt-[1.3em]">Get guidance and support throughout your IPPIS loan application.</p>
        </div>
        <a
          href="tel:8001301448"
          className="relative self-start rounded-[8px] bg-lms-dark-purple px-[12.83px] py-[9.62px] font-urbanist text-[9px] leading-none font-semibold text-lms-blue transition-transform duration-200 hover:-translate-y-px"
        >
          Get Help →
        </a>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-4 rounded-[4px] p-3 text-left transition-colors hover:bg-app-bg"
      >
        <img src={navLogout} alt="" className="block size-5" />
        <span className="flex-1 font-inter text-[16px] leading-5 font-medium text-nav">Logout</span>
      </button>
    </aside>
  )
}
