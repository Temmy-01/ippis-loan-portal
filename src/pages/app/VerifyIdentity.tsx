import { useId, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'

import iconCamera from '@/assets/app/icon-camera.svg'
import iconInfoDot from '@/assets/app/icon-info-dot.svg'
import iconUserOutline from '@/assets/app/icon-user-outline.svg'
import successCheck from '@/assets/app/success-check.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'

const STEPS = [
  'Allow camera access when asked',
  'Make sure your face is clearly visible',
  'Use a well-lit space and remove face coverings',
  'Follow each instruction on screen',
]

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export default function VerifyIdentity() {
  const navigate = useNavigate()
  const titleId = useId()
  const [cameraOn, setCameraOn] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [done, setDone] = useState(false)

  const handlePrimary = async () => {
    if (!cameraOn) {
      setCameraOn(true)
      return
    }
    setCompleting(true)
    // TODO: replace with the real identity verification result.
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCompleting(false)
    setDone(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Identity Verification"
        title="Let's verify it's you"
        description="For your security, we need to confirm your identity before proceeding. Follow the instructions on the screen to complete the verification."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section
          className="anim-fade-up flex flex-col gap-4 self-start rounded-[18px] bg-cam-frame p-4 sm:p-6"
          style={delay(100)}
        >
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-5 rounded-[12px] bg-cam-screen py-10 sm:min-h-[480px] sm:py-[72.6px]">
            <div
              className={cn(
                'relative flex h-[290px] w-[220px] items-center justify-center rounded-t-[114.75px] rounded-b-[122.4px] border-[3px] border-dashed border-lms-lilac transition-shadow duration-500',
                cameraOn && 'shadow-[0_0_0_10px_rgb(200_125_254/0.08)]',
              )}
            >
              <img
                src={iconUserOutline}
                alt=""
                className={cn('block size-[72px] transition-transform duration-500', cameraOn && 'scale-110')}
              />
              {cameraOn && (
                <span className="pointer-events-none absolute inset-x-6 top-6 h-0.5 animate-[scan_2.6s_ease-in-out_infinite] rounded-full bg-lms-lilac/70 shadow-[0_0_12px_2px_rgb(200_125_254/0.5)]" />
              )}
            </div>
            <p key={String(cameraOn)} className="anim-fade-in px-4 text-center font-inter text-[16px] leading-[24.8px] text-cam-muted">
              {cameraOn ? 'Position your face inside the guide' : 'Camera preview will appear here'}
            </p>
          </div>

          <div className="flex h-5 items-center gap-2 pl-2 font-inter text-[13px] leading-[20.15px] text-white">
            {cameraOn ? (
              <>
                <span className="anim-pulse-ring size-2 rounded-[4px] bg-success" />
                Prototype camera preview
              </>
            ) : (
              'Camera is not active'
            )}
          </div>
        </section>

        <section
          className="anim-fade-up flex flex-col rounded-[16px] border border-app-line bg-white p-5 sm:p-7 lg:min-h-[555.63px]"
          style={delay(180)}
        >
          <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
            Before you start
          </h2>

          <ol className="mt-[3px]">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className={cn(
                  'anim-fade-up flex items-center gap-3 border-b border-app-line pb-[15px]',
                  index === 0 ? 'pt-[18px]' : 'pt-[14px]',
                )}
                style={delay(260 + index * 60)}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[14px] bg-lilac-soft font-inter text-[14px] leading-[21.7px] font-bold text-lms-purple">
                  {index + 1}
                </span>
                <span className="font-inter text-[14px] leading-[21.7px] font-bold text-app-ink">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex items-start gap-[11px] rounded-[12px] bg-sky-soft px-4 py-[14px]">
            <img src={iconInfoDot} alt="" className="block h-5 w-[8.81px] shrink-0" />
            <p className="font-inter text-[14px] leading-[21.7px] text-sky-ink">
              This prototype demonstrates the experience only. No identity verification or camera capture is taking
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrimary}
            disabled={completing}
            className="mt-5 flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] bg-lms-purple px-[23px] py-3 font-inter text-[16px] leading-[24.8px] font-bold text-white shadow-[0_6px_7px_0_rgb(124_46_191/0.16)] transition-all duration-200 hover:-translate-y-px hover:bg-[#6c25a9] disabled:pointer-events-none disabled:opacity-80"
          >
            {completing ? (
              <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Loading" />
            ) : cameraOn ? (
              'Complete Demo Verification'
            ) : (
              <>
                <img src={iconCamera} alt="" className="block size-5" />
                Start Verification
              </>
            )}
          </button>
          <a
            href="tel:8001301448"
            className="flex min-h-[50px] items-center justify-center rounded-[10px] px-[11px] font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple transition-colors hover:bg-lilac-soft"
          >
            Need Help?
          </a>
        </section>
      </div>

      <Modal open={done} onClose={() => setDone(false)} labelledBy={titleId} className="sm:min-h-[541px]">
        <div className="flex flex-col items-center gap-[37.75px] px-5 py-12 text-center sm:min-h-[541px] sm:justify-center sm:px-[25px]">
          <img src={successCheck} alt="" className="anim-pop block size-[113.252px]" style={{ animationDuration: '0.5s' }} />
          <div className="flex max-w-[394px] flex-col gap-1.5">
            <h2 id={titleId} className="font-poppins text-[26px] leading-[48px] font-semibold text-lms-dark-purple sm:text-[30px]">
              Verification completed
            </h2>
            <p className="font-inter text-[17px] leading-[25px] text-ink-navy sm:text-[18px]">
              Your identity verification has been completed successfully. We'll continue processing your application.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>Return to Application</Button>
        </div>
      </Modal>
    </div>
  )
}
