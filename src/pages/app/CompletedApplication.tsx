import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import { Link, useParams } from 'react-router-dom'

import iconTimelineDone from '@/assets/app/icon-timeline-done.svg'
import iconTimelinePending from '@/assets/app/icon-timeline-pending.svg'
import { PageHeader } from '@/components/app/PageHeader'
import { StatusPill } from '@/components/app/StatusPill'
import { getLoanPackage, type LoanPackageId } from '@/data/loanPackages'
import type { ApplicationStatus, StatusSummary } from '@/features/application/status'
import { useTimeline } from '@/features/application/useTimeline'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { formatDate, formatDateTime, formatNaira } from '@/lib/format'

type ApplicationView = {
  id: string
  reference: string
  loanPackage: LoanPackageId
  status: ApplicationStatus
  summary: StatusSummary | null
  data: Record<string, string>
  documents: { slot: string; fileName: string }[]
  startedAt: string
  submittedAt: string | null
}

const DOCUMENT_LABELS: Record<string, string> = {
  workId: 'Work ID Card',
  passport: 'Passport Photograph',
  face: 'Face check photo',
}

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

function Card({ title, children, ms }: { title: string; children: ReactNode; ms: number }) {
  return (
    <section className="anim-fade-up rounded-[16px] border border-app-line bg-white p-5 sm:p-7" style={delay(ms)}>
      <h2 className="mb-4 font-inter text-[18px] leading-[28px] font-bold text-app-ink">{title}</h2>
      {children}
    </section>
  )
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">{label}</dt>
      <dd className="break-words font-inter text-[15px] leading-[23px] font-bold text-app-ink">{value || '—'}</dd>
    </div>
  )
}

function DocumentImage({ applicationId, slot, fileName }: { applicationId: string; slot: string; fileName: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api<{ content: string; mimeType: string }>(`/portal/applications/${applicationId}/documents/${slot}`, { auth: true }).then((result) => {
      if (!cancelled && result.ok && result.payload) setSrc(result.payload.content)
    })
    return () => {
      cancelled = true
    }
  }, [applicationId, slot])

  const isPdf = src?.startsWith('data:application/pdf')
  return (
    <figure className="overflow-hidden rounded-[12px] border border-app-line">
      <div className="flex h-40 items-center justify-center bg-app-bg">
        {!src ? (
          <span className="anim-spin size-5 rounded-full border-2 border-lms-purple/30 border-t-lms-purple" aria-label="Loading" />
        ) : isPdf ? (
          <a href={src} target="_blank" rel="noopener noreferrer" className="font-inter text-[14px] font-bold text-lms-purple underline">
            Open PDF
          </a>
        ) : (
          <img src={src} alt={DOCUMENT_LABELS[slot] ?? slot} className="size-full object-contain" />
        )}
      </div>
      <figcaption className="border-t border-app-line px-3 py-2 font-inter text-[13px] text-app-muted">
        <span className="font-bold text-app-ink">{DOCUMENT_LABELS[slot] ?? slot}</span> · {fileName}
      </figcaption>
    </figure>
  )
}

export default function CompletedApplication() {
  const { id = '' } = useParams()
  const [app, setApp] = useState<ApplicationView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { timeline } = useTimeline(id)

  useEffect(() => {
    api<ApplicationView>(`/portal/applications/${id}`, { auth: true }).then((result) => {
      if (result.ok && result.payload) setApp(result.payload)
      else setError(result.message)
    })
  }, [id])

  const back = (
    <Link to="/applications" className="inline-flex items-center gap-1.5 self-start font-inter text-[14px] font-bold text-lms-purple hover:underline">
      <LuArrowLeft className="size-4" /> My Applications
    </Link>
  )

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        {back}
        <p className="font-inter text-[16px] text-app-muted">{error}</p>
      </div>
    )
  }
  if (!app) return null

  const data = app.data ?? {}
  const history = timeline?.history ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {back}
        <PageHeader
          eyebrow="Completed Application"
          title={`${getLoanPackage(app.loanPackage).shortName} Application`}
          description={`Application ID ${app.reference}. This record is read-only.`}
        />
        {app.summary && <StatusPill tone={app.summary.tone} label={app.summary.label} />}
      </div>

      <Card title="Summary" ms={80}>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
          <Detail label="How much do you need" value={formatNaira(data.amount ?? '')} />
          <Detail label="Loan Tenor" value={data.repaymentPeriod} />
          <Detail label="Date Started" value={formatDate(app.startedAt.slice(0, 10))} />
          <Detail label="Date Submitted" value={app.submittedAt ? formatDateTime(app.submittedAt) : ''} />
        </dl>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Your details" ms={140}>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label="Full name" value={data.fullName} />
            <Detail label="Date of birth" value={data.dateOfBirth ? formatDate(data.dateOfBirth) : ''} />
            <Detail label="Phone" value={data.phone} />
            <Detail label="Email" value={data.email} />
            <Detail label="State" value={data.state} />
            <Detail label="Address" value={data.address} />
          </dl>
        </Card>
        <Card title="Employment & loan" ms={180}>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label="Employer" value={data.employer} />
            <Detail label="Staff Identity number" value={data.ippisNumber} />
            <Detail label="Loan purpose" value={data.purpose} />
            <Detail label="Loan Tenor" value={data.repaymentPeriod} />
          </dl>
        </Card>
      </div>

      <Card title="Documents" ms={220}>
        {app.documents.length === 0 ? (
          <p className="font-inter text-[14px] text-app-muted">No documents on this application.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {app.documents.map((doc) => (
              <DocumentImage key={doc.slot} applicationId={app.id} slot={doc.slot} fileName={doc.fileName} />
            ))}
          </div>
        )}
      </Card>

      <Card title="Application history" ms={260}>
        <ol className="pl-5">
          {history.map((event, index) => (
            <li
              key={`${event.title}-${event.at ?? 'waiting'}`}
              className={cn('relative border-l-2 pb-6 pl-7', index === history.length - 1 ? 'border-transparent' : 'border-app-line')}
            >
              <span
                className={cn(
                  'absolute top-0 -left-[15px] flex size-7 items-center justify-center rounded-full border-2 border-lms-purple',
                  event.done ? 'bg-lms-purple' : 'bg-white',
                )}
              >
                <img src={event.done ? iconTimelineDone : iconTimelinePending} alt="" className="block size-[13px]" />
              </span>
              <p className="font-inter text-[15px] leading-[22px] font-bold text-app-ink">{event.title}</p>
              <p className="font-inter text-[12.5px] leading-[19px] text-app-muted">{event.at ? formatDateTime(event.at) : 'Waiting'}</p>
              <p className="pt-1 font-inter text-[14px] leading-[21px] text-app-muted">{event.description}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
