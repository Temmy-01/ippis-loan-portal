import { useRef, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import iconUpload from '@/assets/apply/icon-upload.svg'
import infoDocuments from '@/assets/apply/info-documents.svg'
import { InfoBox } from '@/components/apply/InfoBox'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { REQUIRED_UPLOADS, UPLOAD_SLOTS } from '@/data/applicationOptions'
import { useApplication, type UploadSlot } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/format'

type SlotConfig = (typeof UPLOAD_SLOTS)[number]

const MAX_FILE_BYTES = 5 * 1024 * 1024

function matchesAccept(file: File, accept: string) {
  return accept.split(',').some((type) => (type.endsWith('/*') ? file.type.startsWith(type.slice(0, -1)) : file.type === type))
}

function UploadBox({ config, error, onError }: { config: SlotConfig; error?: string; onError: (message?: string) => void }) {
  const { data, uploadDocument, removeDocument } = useApplication()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const file = data.uploads[config.slot]

  const setFile = async (next: File | undefined) => {
    if (!next || busy) return
    if (!matchesAccept(next, config.accept)) {
      onError(`${config.label} must be ${config.hint === 'Image only' ? 'an image' : 'an image or PDF'}`)
      return
    }
    if (next.size > MAX_FILE_BYTES) {
      onError('The file is too large. The maximum size is 5MB.')
      return
    }
    setBusy(true)
    const error = await uploadDocument(config.slot, next)
    setBusy(false)
    onError(error ?? undefined)
  }

  const remove = async () => {
    setBusy(true)
    const error = await removeDocument(config.slot)
    setBusy(false)
    onError(error ?? undefined)
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    setFile(event.dataTransfer.files[0])
  }

  return (
    <div className="flex flex-col gap-[7px]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-inter text-[15px] leading-[23.25px] font-semibold text-app-ink">{config.label}</span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-inter text-[11px] font-bold',
            config.required ? 'bg-lilac-soft text-lms-purple' : 'bg-app-bg text-app-muted',
          )}
        >
          {config.required ? 'Required' : 'Optional'}
        </span>
      </div>

      <div className="relative">
      {file ? (
        <div className="anim-fade-in flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-lms-lilac bg-lilac-soft/40 px-4 py-5 text-center">
          <span className="anim-pop flex size-12 items-center justify-center rounded-[24px] bg-lms-purple font-inter text-[11px] font-bold text-white uppercase">
            {file.name.split('.').pop()?.slice(0, 4)}
          </span>
          <p className="max-w-full truncate font-inter text-[14px] font-bold text-app-ink">{file.name}</p>
          <p className="font-inter text-[12px] text-app-muted">{formatFileSize(file.size)} · Uploaded</p>
          <div className="flex gap-1">
            <button type="button" onClick={() => inputRef.current?.click()} className="rounded-md px-2 py-1 font-inter text-[13px] font-bold text-lms-purple hover:bg-white">
              Replace
            </button>
            <button type="button" onClick={remove} className="rounded-md px-2 py-1 font-inter text-[13px] font-bold text-app-muted hover:bg-white">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Upload ${config.label}`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'group flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed px-4 py-5 text-center transition-all duration-200',
            'focus-visible:outline-2 focus-visible:outline-lms-lilac',
            dragging ? 'scale-[1.01] border-lms-purple bg-lilac-soft/60' : 'border-[#bcb5c2] bg-[#fdfcfe] hover:border-lms-lilac',
            error && 'anim-shake border-danger',
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-[20px] bg-lilac-soft transition-transform duration-300 group-hover:-translate-y-1">
            <img src={iconUpload} alt="" className="block size-5" />
          </span>
          <p className="font-inter text-[14px] leading-[21px] font-bold text-app-ink">Drag and drop or <span className="text-lms-purple group-hover:underline">browse</span></p>
          <p className="font-inter text-[12px] leading-[18.6px] text-app-muted">{config.hint}</p>
        </div>
      )}

      {busy && (
        <div className="anim-fade-in absolute inset-0 flex items-center justify-center gap-2 rounded-[14px] bg-white/80 font-inter text-[13px] font-bold text-lms-purple">
          <span className="anim-spin size-4 rounded-full border-2 border-lms-lilac/40 border-t-lms-purple" />
          Please wait…
        </div>
      )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          setFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      {error && (
        <p role="alert" className="anim-fade-in font-inter text-[13px] leading-[20.15px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default function DocumentsStep() {
  const navigate = useNavigate()
  const { data } = useApplication()
  const [errors, setErrors] = useState<Partial<Record<UploadSlot, string>>>({})

  const handleContinue = () => {
    const missing: Partial<Record<UploadSlot, string>> = {}
    for (const slot of REQUIRED_UPLOADS) {
      if (!data.uploads[slot]) missing[slot] = `Upload your ${UPLOAD_SLOTS.find((item) => item.slot === slot)?.label}`
    }
    setErrors(missing)
    if (Object.keys(missing).length === 0) navigate('/apply/review')
  }

  return (
    <StepPage index={4} onContinue={handleContinue}>
      <StepCard>
        <div className="flex flex-col gap-5">
          <InfoBox icon={infoDocuments} iconWidth={19.07}>
            Work ID Card, Passport Photograph and Signature are required. Other Documents is optional. Make sure each
            file is clear and readable.
          </InfoBox>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {UPLOAD_SLOTS.map((config) => (
              <UploadBox
                key={config.slot}
                config={config}
                error={errors[config.slot]}
                onError={(message) => setErrors((prev) => ({ ...prev, [config.slot]: message }))}
              />
            ))}
          </div>
        </div>
      </StepCard>
    </StepPage>
  )
}
