import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import iconSaved from '@/assets/apply/icon-saved.svg'
import { Stepper } from '@/components/apply/Stepper'
import { Logo } from '@/components/ui/Logo'
import { useApplication } from '@/features/application/ApplicationContext'

export function ApplyLayout({ current, children }: { current: number; children: ReactNode }) {
  const { saveStatus } = useApplication()

  useEffect(() => {
    document.body.style.backgroundColor = '#f8f7fa'
  }, [])

  return (
    <div className="flex min-h-dvh flex-col items-center gap-5 bg-app-bg">
      <header className="sticky top-0 z-20 grid h-[76px] w-full grid-cols-[1fr_auto_1fr] items-center border-b border-app-line bg-white/95 px-4 backdrop-blur sm:px-8 xl:px-[72px]">
        <Link
          to="/dashboard"
          className="justify-self-start font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-transform hover:-translate-x-0.5"
        >
          ← <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Logo tone="color" width={166} height={31} />
        <p className="flex items-center gap-1.5 justify-self-end font-inter text-[13px] leading-[20.15px]" aria-live="polite">
          {saveStatus === 'error' ? (
            <span className="text-danger">Couldn't save. Check your connection.</span>
          ) : saveStatus === 'saving' ? (
            <>
              <span className="anim-spin size-3.5 rounded-full border-2 border-app-line border-t-app-muted" />
              <span className="hidden text-app-muted sm:inline">Saving…</span>
            </>
          ) : (
            <>
              <img src={iconSaved} alt="" className="anim-pop block size-4" />
              <span className="hidden text-[#147a55] sm:inline">All changes saved</span>
            </>
          )}
        </p>
      </header>

      <Stepper current={current} />

      {children}
    </div>
  )
}
