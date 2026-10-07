import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import iconCamera from '@/assets/app/icon-camera.svg'
import iconInfoDot from '@/assets/app/icon-info-dot.svg'
import iconUserOutline from '@/assets/app/icon-user-outline.svg'
import successCheck from '@/assets/app/success-check.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'

const STEPS = [
  'Allow camera access when asked',
  'Make sure your face is clearly visible',
  'Use a well-lit space and remove face coverings',
  'Look straight at the camera and keep still',
]

const CAMERA_ERRORS: Record<string, string> = {
  NotAllowedError: 'Camera access was blocked. Allow camera access in your browser settings and try again.',
  NotFoundError: "We couldn't find a camera on this device. Try again on a phone or a computer with a camera.",
  NotReadableError: 'Your camera is being used by another app. Close it and try again.',
}

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

function capture(video: HTMLVideoElement) {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d')?.drawImage(video, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.9)
}

function Notice({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <section className="anim-fade-up flex flex-col items-start gap-3 rounded-[16px] border border-app-line bg-white p-6 sm:p-8">
      <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">{title}</h2>
      <p className="max-w-[620px] font-inter text-[16px] leading-[24.8px] text-app-muted">{body}</p>
      {children}
    </section>
  )
}

export default function VerifyIdentity() {
  const navigate = useNavigate()
  const titleId = useId()
  const { data, loading, verifyIdentity } = useApplication()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  useEffect(() => stopCamera, [])

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
    } catch (cameraError) {
      setError(CAMERA_ERRORS[(cameraError as Error).name] ?? "We couldn't start your camera. Please try again.")
    }
  }

  const takePhoto = async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    setChecking(true)
    setError(null)
    const result = await verifyIdentity(capture(video))
    setChecking(false)
    if (result.ok) {
      stopCamera()
      setDone(true)
      return
    }
    const left = result.attemptsLeft
    setError(left ? `${result.message} You have ${left} ${left === 1 ? 'try' : 'tries'} left.` : result.message)
    if (left === 0) stopCamera()
  }

  const header = (
    <PageHeader
      eyebrow="Identity Verification"
      title="Let's verify it's you"
      description="For your security, we need to confirm your identity before proceeding. Follow the instructions on the screen to complete the verification."
    />
  )

  if (loading) return null

  if (!done && data.identity?.status !== 'required') {
    const verified = data.identity?.status === 'verified'
    const locked = data.identity?.status === 'locked'
    return (
      <div className="flex flex-col gap-8">
        {header}
        <Notice
          title={verified ? 'Your identity is verified' : locked ? "We couldn't verify your identity" : 'No verification needed yet'}
          body={
            verified
              ? 'Thank you. Our loan team is continuing with your application.'
              : locked
                ? 'Too many face checks did not pass. Please contact support or your relationship manager to continue.'
                : "We'll let you know by email, SMS and in the portal when we need you to verify your identity."
          }
        >
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/track" className={PRIMARY_BUTTON}>
              Track My Application
            </Link>
            {locked && (
              <a href="tel:8001301448" className="font-inter text-[16px] font-bold text-lms-purple hover:underline">
                Contact Support
              </a>
            )}
          </div>
        </Notice>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {header}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="anim-fade-up flex flex-col gap-4 self-start rounded-[18px] bg-cam-frame p-4 sm:p-6" style={delay(100)}>
          <div className="relative flex min-h-[380px] flex-col items-center justify-center gap-5 overflow-hidden rounded-[12px] bg-cam-screen py-10 sm:min-h-[480px] sm:py-[72.6px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn('absolute inset-0 size-full -scale-x-100 object-cover', !cameraOn && 'hidden')}
            />
            <div
              className={cn(
                'relative flex h-[290px] w-[220px] items-center justify-center rounded-t-[114.75px] rounded-b-[122.4px] border-[3px] border-dashed border-lms-lilac transition-shadow duration-500',
                cameraOn && 'shadow-[0_0_0_9999px_rgb(20_12_28/0.45)]',
              )}
            >
              {!cameraOn && <img src={iconUserOutline} alt="" className="block size-[72px]" />}
              {checking && (
                <span className="pointer-events-none absolute inset-x-6 top-6 h-0.5 animate-[scan_2.6s_ease-in-out_infinite] rounded-full bg-lms-lilac/70 shadow-[0_0_12px_2px_rgb(200_125_254/0.5)]" />
              )}
            </div>
            <p key={String(cameraOn)} className="anim-fade-in relative px-4 text-center font-inter text-[16px] leading-[24.8px] text-white">
              {checking ? 'Checking your photo…' : cameraOn ? 'Position your face inside the guide' : 'Camera preview will appear here'}
            </p>
          </div>

          <div className="flex h-5 items-center gap-2 pl-2 font-inter text-[13px] leading-[20.15px] text-white">
            {cameraOn ? (
              <>
                <span className="anim-pulse-ring size-2 rounded-[4px] bg-success" />
                Camera is on
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
          <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">Before you start</h2>

          <ol className="mt-[3px]">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className={cn('anim-fade-up flex items-center gap-3 border-b border-app-line pb-[15px]', index === 0 ? 'pt-[18px]' : 'pt-[14px]')}
                style={delay(260 + index * 60)}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[14px] bg-lilac-soft font-inter text-[14px] leading-[21.7px] font-bold text-lms-purple">
                  {index + 1}
                </span>
                <span className="font-inter text-[14px] leading-[21.7px] font-bold text-app-ink">{step}</span>
              </li>
            ))}
          </ol>

          <div
            role={error ? 'alert' : undefined}
            className={cn('mt-5 flex items-start gap-[11px] rounded-[12px] px-4 py-[14px]', error ? 'bg-[#fdeced]' : 'bg-sky-soft')}
          >
            <img src={iconInfoDot} alt="" className="block h-5 w-[8.81px] shrink-0" />
            <p className={cn('font-inter text-[14px] leading-[21.7px]', error ? 'text-[#b4282d]' : 'text-sky-ink')}>
              {error ??
                `Your photo is only used to confirm your identity against your BVN record. You have ${data.identity?.attemptsLeft ?? 0} tries.`}
            </p>
          </div>

          <button
            type="button"
            onClick={cameraOn ? takePhoto : startCamera}
            disabled={checking || data.identity?.status !== 'required'}
            className="mt-5 flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] bg-lms-purple px-[23px] py-3 font-inter text-[16px] leading-[24.8px] font-bold text-white shadow-[0_6px_7px_0_rgb(124_46_191/0.16)] transition-all duration-200 hover:-translate-y-px hover:bg-[#6c25a9] disabled:pointer-events-none disabled:opacity-80"
          >
            {checking ? (
              <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Checking" />
            ) : cameraOn ? (
              'Take Photo & Verify'
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

      <Modal open={done} onClose={() => navigate('/track')} labelledBy={titleId} className="sm:min-h-[541px]">
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
          <Button onClick={() => navigate('/track')}>Return to Application</Button>
        </div>
      </Modal>
    </div>
  )
}
