import { cn } from '@/lib/cn'
import logoColor from '@/assets/auth/logo.png'
import logoMask from '@/assets/auth/logo-mask.png'

type LogoProps = {
  tone?: 'white' | 'color'
  width?: number
  height?: number
  className?: string
}

export function Logo({ tone = 'color', width = 172, height = 39.497, className }: LogoProps) {
  if (tone === 'white') {
    return (
      <div className={cn('h-[50.46px]', className)}>
        <div
          role="img"
          aria-label="Dominion Merchants & Partners"
          className="h-[45.843px] w-[185.556px] bg-white"
          style={{
            maskImage: `url(${logoMask})`,
            WebkitMaskImage: `url(${logoMask})`,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>
    )
  }

  return (
    <img
      src={logoColor}
      alt="Dominion Merchants & Partners"
      className={cn('block object-contain', className)}
      style={{ width, height }}
    />
  )
}
