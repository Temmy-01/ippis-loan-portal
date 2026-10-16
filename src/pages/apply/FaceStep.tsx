import { useEffect, useState } from 'react'
import { LuCamera, LuCheck, LuScanFace } from 'react-icons/lu'
import { Link } from 'react-router-dom'

import iconUserOutline from '@/assets/app/icon-user-outline.svg'
import { OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { idTypeLabel } from '@/data/applicationOptions'
import { MAX_FACE_CHECKS, useApplication } from '@/features/application/ApplicationContext'
import { useStepNav } from '@/features/application/useStepNav'
import { useCamera } from '@/features/face/useCamera'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

const TIPS = ['Face the camera with good light on your face', 'Remove glasses, caps and face coverings', 'Keep only your face in the frame']

export default function FaceStep() {
  const { goNext } = useStepNav('face')
  const { data, checkFace } = useApplication()
  const { videoRef, cameraOn, error: cameraError, start, stop, capture } = useCamera()
  const [photo, setPhoto] = useState<{ file: File | null; url: string } | null>(null)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string; fixId?: boolean } | null>(null)

  const matched = data.faceCheck.matched && Boolean(data.uploads.face)
  const attemptsLeft = data.faceCheck.attemptsLeft
  const hasId = Boolean(data.uploads.meansOfId && data.idType)

  useEffect(() => {
    if (!matched || photo || !data.id) return
    let cancelled = false
    api<{ content: string }>(`/portal/applications/${data.id}/documents/face`, { auth: true }).then((saved) => {
      if (!cancelled && saved.ok && saved.payload) setPhoto({ file: null, url: saved.payload.content })
    })
    return () => {
      cancelled = true
    }
  }, [matched, photo, data.id])

  useEffect(
    () => () => {
      if (photo?.url.startsWith('blob:')) URL.revokeObjectURL(photo.url)
    },
    [photo],
  )

  const openCamera = () => {
    setPhoto(null)
    setResult(null)
    start()
  }

  const takePhoto = async () => {
    const file = await capture()
    if (file) setPhoto({ file, url: URL.createObjectURL(file) })
  }

  const submitPhoto = async () => {
    if (!photo?.file) return
    setChecking(true)
    const outcome = await checkFace(photo.file)
    setChecking(false)
    setResult({ ok: outcome.ok, message: outcome.message, fixId: outcome.field === 'documents' })
    if (!outcome.ok) setPhoto(null)
  }

  const handleContinue = () => {
    if (!matched) {
      setResult({ ok: false, message: 'Please complete the face check to continue.' })
      return
    }
    goNext()
  }

  const waitingToSend = Boolean(photo?.file) && !checking && !result?.ok
  const outOfAttempts = attemptsLeft <= 0 && !matched

  return (
    <StepPage slug="face" onContinue={handleContinue}>
      <StepCard className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 rounded-[18px] bg-cam-frame p-3 sm:p-4">
            <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[12px] bg-cam-screen sm:min-h-[420px]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn('absolute inset-0 size-full -scale-x-100 object-cover', !cameraOn && 'hidden')}
              />
              {photo && !cameraOn ? (
                <>
                  <img src={photo.url} alt="Your face check photo" className="anim-fade-in absolute inset-0 size-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
                  {(matched || checking) && (
                    <span className="anim-pop absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-success text-white shadow-lg">
                      {checking ? (
                        <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Checking" />
                      ) : (
                        <LuCheck className="size-6" strokeWidth={3} />
                      )}
                    </span>
                  )}
                </>
              ) : (
                <div
                  className={cn(
                    'relative flex h-[260px] w-[200px] items-center justify-center rounded-t-[104px] rounded-b-[112px] border-[3px] border-dashed',
                    cameraOn ? 'border-lms-lilac shadow-[0_0_0_9999px_rgb(20_12_28/0.45)]' : 'border-lms-lilac/70',
                  )}
                >
                  {!cameraOn && <img src={iconUserOutline} alt="" className="block size-[64px]" />}
                </div>
              )}
              <p aria-live="polite" className="absolute inset-x-0 bottom-5 px-4 text-center font-inter text-[16px] leading-[24px] font-bold text-white">
                {checking
                  ? 'Checking your face against your ID…'
                  : matched && !cameraOn
                    ? 'Your face matches your ID'
                    : cameraOn
                      ? 'Place your face inside the guide'
                      : waitingToSend
                        ? 'Happy with this photo?'
                        : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2.5">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 font-inter text-[15px] leading-[22px] text-app-muted">
                  <LuCheck className="mt-0.5 size-4 shrink-0 text-lms-purple" strokeWidth={3} />
                  {tip}
                </li>
              ))}
            </ul>

            <p className="rounded-[12px] bg-sky-soft px-4 py-3 font-inter text-[14px] leading-[21px] text-sky-ink">
              We compare your photo with the photo on your {idTypeLabel(data.idType) || 'Valid ID'} to confirm it's really you. Your photo
              is saved with your application for our loan team.
            </p>

            {!hasId && (
              <p role="alert" className="rounded-[12px] bg-[#fdeced] px-4 py-3 font-inter text-[14px] leading-[21px] text-[#b4282d]">
                Please upload your Valid ID on the{' '}
                <Link to="/apply/documents" className="font-bold underline">
                  Documents step
                </Link>{' '}
                first.
              </p>
            )}

            {(cameraError || (result && !result.ok)) && (
              <p role="alert" className="rounded-[12px] bg-[#fdeced] px-4 py-3 font-inter text-[14px] leading-[21px] text-[#b4282d]">
                {cameraError || result?.message}{' '}
                {result?.fixId && (
                  <Link to="/apply/documents" className="font-bold underline">
                    Go to Documents
                  </Link>
                )}
              </p>
            )}
            {result?.ok && (
              <p role="status" className="rounded-[12px] bg-[#e7f6ef] px-4 py-3 font-inter text-[14px] leading-[21px] text-[#147a55]">
                {result.message}
              </p>
            )}

            {outOfAttempts ? null : cameraOn ? (
              <div className="flex flex-col gap-2">
                <button type="button" onClick={takePhoto} className={cn(PRIMARY_BUTTON, 'justify-center gap-2')}>
                  <LuCamera className="size-5" /> Take Photo
                </button>
                <button type="button" onClick={stop} className="font-inter text-[15px] font-bold text-lms-purple hover:underline">
                  Cancel
                </button>
              </div>
            ) : waitingToSend ? (
              <div className="flex flex-col gap-2">
                <button type="button" onClick={submitPhoto} className={cn(PRIMARY_BUTTON, 'justify-center')}>
                  Use This Photo
                </button>
                <button type="button" onClick={openCamera} className={cn(OUTLINE_BUTTON, 'justify-center')}>
                  Retake
                </button>
              </div>
            ) : (
              <button type="button" onClick={openCamera} disabled={!hasId || checking} className={cn(PRIMARY_BUTTON, 'justify-center gap-2 disabled:opacity-50')}>
                <LuScanFace className="size-5" />
                {matched ? 'Retake Face Check' : 'Start Face Check'}
              </button>
            )}

            {!matched && attemptsLeft < MAX_FACE_CHECKS && (
              <p className="font-inter text-[13px] text-app-muted">
                {outOfAttempts
                  ? 'You have used all your face check attempts for this application. Please contact us for help.'
                  : `${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`}
              </p>
            )}
          </div>
        </div>
      </StepCard>
    </StepPage>
  )
}
