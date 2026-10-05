import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'
import glowDark from '@/assets/auth/bg-glow-dark.svg'
import ringsDark from '@/assets/auth/bg-rings-dark.svg'
import ringsLight from '@/assets/auth/bg-rings-light.svg'

type Variant = 'dark' | 'light'

const ARTBOARD: Record<Variant, { width: number; height: number }> = {
  dark: { width: 1440, height: 900 },
  light: { width: 1440, height: 1024 },
}

// Scales a fixed-size artboard to cover the viewport so the rings stay round on any screen.
export function AuthBackground({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const { width, height } = ARTBOARD[variant]

  useEffect(() => {
    document.body.style.backgroundColor = variant === 'dark' ? '#431967' : '#cdebf8'
  }, [variant])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(Math.max(el.clientWidth / width, el.clientHeight / height))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [width, height])

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        variant === 'dark' ? 'bg-lms-dark-purple' : 'bg-lms-blue',
      )}
    >
      <div
        className="absolute top-1/2 left-1/2 overflow-hidden"
        style={{ width, height, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {variant === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-lms-dark-purple" />
            <div className="absolute top-0 left-[735px] h-[900px] w-[705px] bg-lms-teal opacity-[0.08] mix-blend-soft-light" />
            <img
              src={glowDark}
              alt=""
              className="anim-breathe absolute top-[-550px] left-[-550px] block h-[2377px] w-[2838px] max-w-none"
            />
            <img
              src={ringsDark}
              alt=""
              className="anim-drift absolute top-[-643px] left-[-644px] block h-[2360px] w-[2767px] max-w-none"
            />
          </>
        ) : (
          <img
            src={ringsLight}
            alt=""
            className="anim-drift absolute top-[-643px] left-[-644px] block h-[2360px] w-[2767px] max-w-none"
          />
        )}
      </div>
    </div>
  )
}
