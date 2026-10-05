import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: ReactNode
  description: ReactNode
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="anim-fade-up flex flex-col gap-[7.2px]">
      <p className="font-inter text-[12px] leading-[18.6px] font-extrabold tracking-[1.2px] text-lms-purple uppercase">
        {eyebrow}
      </p>
      <h1 className="pt-[2px] font-inter text-[28px] leading-[36px] font-bold tracking-[-1.2px] text-app-ink sm:text-[36px] sm:leading-[43.2px]">
        {title}
      </h1>
      <p className="font-inter text-[16px] leading-[26.35px] text-app-muted sm:text-[17px]">{description}</p>
    </div>
  )
}
