import { useRef, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import iconUpload from '@/assets/apply/icon-upload.svg'
import infoDocuments from '@/assets/apply/info-documents.svg'
import { Field, SelectInput } from '@/components/apply/FormField'
import { InfoBox } from '@/components/apply/InfoBox'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { DOCUMENT_TYPES } from '@/data/applicationOptions'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/format'

export default function DocumentsStep() {
  const navigate = useNavigate()
  const { data, update } = useApplication()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [typeError, setTypeError] = useState('')
  const [listError, setListError] = useState('')

  const addFile = (file: File | undefined) => {
    if (!file) return
    if (!data.documentType) {
      setTypeError('Select a document type before uploading')
      return
    }
    // TODO: upload the file to the API and keep the returned reference.
    const others = data.documents.filter((doc) => doc.type !== data.documentType)
    update({
      documents: [...others, { type: data.documentType, name: file.name, size: file.size }],
      documentType: '',
    })
    setListError('')
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    addFile(event.dataTransfer.files[0])
  }

  const handleContinue = () => {
    if (data.documents.length === 0) {
      setListError('Upload at least one supporting document to continue')
      return
    }
    navigate('/apply/review')
  }

  return (
    <StepPage index={4} onContinue={handleContinue}>
      <StepCard>
        <div className="flex flex-col gap-5">
          <InfoBox icon={infoDocuments} iconWidth={19.07}>
            Required document types are configured by Dominion Merchant. Only upload documents requested on this screen.
          </InfoBox>

          <Field label="Document type" error={typeError}>
            {({ id, describedBy, invalid }) => (
              <SelectInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                placeholder="Select a document type"
                options={DOCUMENT_TYPES}
                value={data.documentType}
                onValueChange={(value) => {
                  update({ documentType: value })
                  setTypeError('')
                }}
              />
            )}
          </Field>

          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'group flex min-h-[230px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed px-4 py-[28.5px] text-center transition-all duration-200',
              'focus-visible:outline-2 focus-visible:outline-lms-lilac',
              dragging ? 'scale-[1.01] border-lms-purple bg-lilac-soft/60' : 'border-[#bcb5c2] bg-[#fdfcfe] hover:border-lms-lilac',
              listError && 'anim-shake border-danger',
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-[24px] bg-lilac-soft transition-transform duration-300 group-hover:-translate-y-1">
              <img src={iconUpload} alt="" className="block size-5" />
            </span>
            <p className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">Drag and drop your file here</p>
            <p className="font-inter text-[16px] leading-[24.8px] text-app-muted">or select a file from your device</p>
            <p className="font-inter text-[16px] leading-[24.8px] font-bold text-lms-purple group-hover:underline">Browse Files</p>
            <p className="font-inter text-[12px] leading-[18.6px] text-app-muted">
              Accepted formats and maximum size are configured by the business.
            </p>
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => {
                addFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </div>

          {listError && (
            <p role="alert" className="anim-fade-in -mt-3 font-inter text-[13px] text-danger">
              {listError}
            </p>
          )}

          {data.documents.length > 0 && (
            <ul className="flex flex-col gap-2">
              {data.documents.map((doc) => (
                <li
                  key={doc.type}
                  className="anim-fade-up flex items-center gap-3 rounded-[12px] border border-app-line bg-white px-4 py-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lilac-soft font-inter text-[11px] font-bold text-lms-purple uppercase">
                    {doc.name.split('.').pop()?.slice(0, 4)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-inter text-[14px] font-bold text-app-ink">{doc.name}</p>
                    <p className="font-inter text-[12px] text-app-muted">
                      {doc.type} · {formatFileSize(doc.size)}
                    </p>
                  </div>
                  <span className="hidden font-inter text-[12px] font-bold text-[#147a55] sm:inline">Uploaded</span>
                  <button
                    type="button"
                    onClick={() => update({ documents: data.documents.filter((item) => item.type !== doc.type) })}
                    className="rounded-md px-2 py-1 font-inter text-[13px] font-bold text-lms-purple hover:bg-lilac-soft"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </StepCard>
    </StepPage>
  )
}
