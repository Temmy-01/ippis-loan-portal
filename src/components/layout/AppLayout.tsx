import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { ChangePasswordModal } from '@/components/app/ChangePasswordModal'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { mockUser } from '@/data/mockUser'
import { cn } from '@/lib/cn'

const GREETING_ROUTES = ['/verify-identity']

export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  useEffect(() => {
    document.body.style.backgroundColor = '#f8f7fa'
  }, [])

  const logout = () => navigate('/login')

  return (
    <div className="min-h-dvh bg-app-bg">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar onLogout={logout} />
      </div>

      <div className={cn('fixed inset-0 z-40 lg:hidden', drawerOpen ? 'visible' : 'invisible')}>
        <div
          className={cn('absolute inset-0 bg-[#1d1324]/40 transition-opacity duration-300', drawerOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-transform duration-300 ease-out',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar onNavigate={() => setDrawerOpen(false)} onLogout={logout} />
        </div>
      </div>

      <div className="flex min-h-dvh flex-col lg:pl-[270px]">
        <Header
          leading={
            GREETING_ROUTES.includes(pathname) ? (
              <p className="truncate font-inter text-[16px] leading-[24.8px] text-app-muted">
                Welcome back, <strong className="font-bold text-app-ink">{mockUser.firstName}</strong>
              </p>
            ) : undefined
          }
          onOpenMenu={() => setDrawerOpen(true)}
          onChangePassword={() => setPasswordOpen(true)}
          onLogout={logout}
        />
        <main key={pathname} className="w-full max-w-[1280px] px-4 pt-8 pb-20 sm:px-8 sm:pt-12 xl:px-[57.6px]">
          <Outlet />
        </main>
      </div>

      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  )
}
