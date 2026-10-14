import { useCallback, useEffect, useState } from 'react'
import { LuCheck, LuScanFace } from 'react-icons/lu'

import iconUserOutline from '@/assets/app/icon-user-outline.svg'
import { PRIMARY_BUTTON } from '@/components/apply/buttonStyles'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepNav } from '@/features/application/useStepNav'
import { preloadLandmarker, STAGE_TEXT, useLiveness, type LivenessStage } from '@/features/face/useLiveness'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

const CHECKS: { stage: LivenessStage; label: string }[] = [
  { stage: 'position', label: 'Face in the guide' },
  { stage: 'blink', label: 'Blink your eyes' },
  { stage: 'turn', label: 'Turn your head' },
  { stage: 'center', label: 'Look straight ahead' },
]

const ORDER: LivenessStage[] = ['position', 'blink', 'turn', 'center', 'done']

export default function FaceStep() {
  const { goNext } = useStepNav('face')
  const { data, uploadDocument } = useApplication()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const completed = Boolean(data.uploads.face)

  useEffect(() => {
    if (!completed) preloadLandmarker()
  }, [completed])

  useEffect(() => {
    if (!completed || photo || !data.id) return
    let cancelled = false
    api<{ content: string }>(`/portal/applications/${data.id}/documents/face`, { auth: true }).then((result) => {
      if (!cancelled && result.ok && result.payload) setPhoto(result.payload.content)
    })
    return () => {
      cancelled = true
    }
  }, [completed, photo, data.id])

  useEffect(
    () => () => {
      if (photo?.startsWith('blob:')) URL.revokeObjectURL(photo)
    },
    [photo],
  )

  
  const handleCaptured = useCallback(
    async (captured: File) => {
      setPhoto(URL.createObjectURL(captured))
      setSaving(true)
      setSaveError(null)
      const problem = await uploadDocument('face', captured)
      setSaving(false)
      if (problem) setSaveError(problem)
    },
    [uploadDocument],
  )

  const { videoRef, stage, warning, error, start, reset, cameraOn } = useLiveness(handleCaptured)
  const position = ORDER.indexOf(stage)
  const busy = stage === 'loading' || saving

  const handleContinue = () => {
    if (!completed) {
      setStepError('Please complete the face check to continue')
      return
    }
    goNext()
  }

  const restart = () => {
    setSaveError(null)
    setStepError(null)
    setPhoto(null)
    start()
  }

  const showPhoto = Boolean(photo) && !cameraOn && stage !== 'loading'

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
              {showPhoto ? (
                <>
                  <img src={photo as string} alt="Your face check photo" className="anim-fade-in absolute inset-0 size-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
                  <span
                    className={cn(
                      'anim-pop absolute top-4 right-4 flex size-11 items-center justify-center rounded-full text-white shadow-lg',
                      saveError ? 'bg-[#b4282d]' : 'bg-success',
                    )}
                  >
                    {saving ? (
                      <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Saving" />
                    ) : (
                      <LuCheck className="size-6" strokeWidth={3} />
                    )}
                  </span>
                </>
              ) : (
                <div
                  className={cn(
                    'relative flex h-[260px] w-[200px] items-center justify-center rounded-t-[104px] rounded-b-[112px] border-[3px] border-dashed transition-colors duration-300',
                    cameraOn ? 'border-lms-lilac shadow-[0_0_0_9999px_rgb(20_12_28/0.45)]' : 'border-lms-lilac/70',
                  )}
                >
                  {!cameraOn && !completed && <img src={iconUserOutline} alt="" className="block size-[64px]" />}
                  {!cameraOn && completed && (
                    <span className="anim-pop flex size-16 items-center justify-center rounded-full bg-success text-white">
                      <LuCheck className="size-8" strokeWidth={3} />
                    </span>
                  )}
                </div>
              )}
              <p
                key={`${stage}-${saving}`}
                aria-live="polite"
                className="anim-fade-in absolute inset-x-0 bottom-5 px-4 text-center font-inter text-[16px] leading-[24px] font-bold text-white"
              >
                {saving
                  ? 'Saving your photo…'
                  : saveError
                    ? "Your photo wasn't saved"
                    : showPhoto || (completed && stage === 'idle')
                      ? 'Face check complete'
                      : STAGE_TEXT[stage]}
              </p>
            </div>
            <p className="min-h-5 px-1 font-inter text-[13px] leading-[20px] text-[#f5c26b]" aria-live="polite">
              {cameraOn ? warning : ''}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ol className="flex flex-col gap-3">
              {CHECKS.map((check, index) => {
                const done = completed || position > index
                const active = position === index
                return (
                  <li key={check.stage} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full font-inter text-[14px] font-bold transition-colors',
                        done ? 'bg-success text-white' : active ? 'bg-lms-purple text-white' : 'bg-lilac-soft text-lms-purple',
                      )}
                    >
                      {done ? <LuCheck className="size-4" strokeWidth={3} /> : index + 1}
                    </span>
                    <span className={cn('font-inter text-[15px] leading-[22px]', active ? 'font-bold text-app-ink' : 'text-app-muted')}>
                      {check.label}
                    </span>
                  </li>
                )
              })}
            </ol>

            <p className="rounded-[12px] bg-sky-soft px-4 py-3 font-inter text-[14px] leading-[21px] text-sky-ink">
              This confirms a real person is applying. Use good lighting, remove face coverings and keep only your face in
              view. Your photo is saved with your application for our loan team.
            </p>

            {(error || saveError || stepError) && (
              <p role="alert" className="rounded-[12px] bg-[#fdeced] px-4 py-3 font-inter text-[14px] leading-[21px] text-[#b4282d]">
                {error || saveError || stepError}
              </p>
            )}

            {cameraOn ? (
              <button type="button" onClick={reset} className="font-inter text-[15px] font-bold text-lms-purple hover:underline">
                Cancel
              </button>
            ) : (
              <button type="button" onClick={restart} disabled={busy} className={cn(PRIMARY_BUTTON, 'justify-center')}>
                {busy ? (
                  <span className="anim-spin size-5 rounded-full border-2 border-white/40 border-t-white" aria-label="Loading" />
                ) : (
                  <>
                    <LuScanFace className="size-5" />
                    {completed || stage === 'done' ? 'Retake Face Check' : error || saveError ? 'Try Again' : 'Start Face Check'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </StepCard>
    </StepPage>
  )
}
