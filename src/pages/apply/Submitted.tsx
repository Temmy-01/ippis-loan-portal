import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import iconSubmittedCheck from '@/assets/apply/icon-submitted-check.svg'
import infoNext from '@/assets/apply/info-next.svg'
import { OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { InfoBox } from '@/components/apply/InfoBox'
import { mockApplication } from '@/data/mockUser'
import { useApplication } from '@/features/application/ApplicationContext'
import { formatDateTime } from '@/lib/format'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function Submitted() {
  const { data } = useApplication()
  const [fallback] = useState(() => new Date().toISOString())
  const submitted = formatDateTime(data.submittedAt ?? fallback)

  return (
    <div className="flex justify-center sm:pt-0">
      <section className="anim-card-in flex w-full max-w-[720px] flex-col items-center gap-2.5 rounded-[24px] border border-app-line bg-white px-5 py-10 text-center drop-shadow-[0_12px_19px_rgb(52_34_67/0.08)] sm:p-14">
        <span className="relative flex size-[72px] items-center justify-center rounded-[36px] bg-lilac-soft">
          <span className="absolute inset-0 animate-ping rounded-full bg-lilac-soft opacity-60 [animation-iteration-count:2]" />
          <img src={iconSubmittedCheck} alt="" className="anim-pop relative block size-8" style={{ animationDelay: '250ms' }} />
        </span>

        <h1
          className="anim-fade-up pt-[14px] font-inter text-[26px] leading-[34px] font-bold tracking-[-1px] text-app-ink sm:text-[34px] sm:leading-[40.8px]"
          style={delay(150)}
        >
          Your application has been submitted!
        </h1>
        <p className="anim-fade-up max-w-[640px] font-inter text-[16px] leading-[24.8px] text-app-muted" style={delay(220)}>
          Thank you for applying with Dominion Merchant. Your application has been received and will be reviewed by
          our loan team.
        </p>

        <dl
          className="anim-fade-up mt-5 grid w-full grid-cols-1 gap-3 rounded-[12px] border border-app-line p-[19px] text-left sm:grid-cols-3"
          style={delay(300)}
        >
          <div className="flex flex-col gap-1">
            <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">Application ID</dt>
            <dd className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{mockApplication.id}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">Submitted</dt>
            <dd className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{submitted}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">Current status</dt>
            <dd className="flex min-h-7 items-center gap-[7px] rounded-[20px] bg-sky-soft px-2.5 py-1">
              <span className="size-[7px] rounded-full bg-app-muted" />
              <span className="font-inter text-[12px] leading-[18.6px] font-bold text-app-muted">Submitted</span>
            </dd>
          </div>
        </dl>

        <div className="anim-fade-up mt-0.5 w-full pb-5 text-left" style={delay(380)}>
          <InfoBox icon={infoNext} iconWidth={11.43} title="What happens next?">
            Our loan team will review your application. We'll notify you in the portal if an update or action is
            required. Submission does not guarantee approval.
          </InfoBox>
        </div>

        <div className="anim-fade-up mt-3 flex flex-wrap justify-center gap-3" style={delay(460)}>
          <Link to="/track" className={PRIMARY_BUTTON}>
            Track My Application
          </Link>
          <Link to="/dashboard" className={OUTLINE_BUTTON}>
            Return to Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}
