import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import type { LoanPackageId } from '@/data/loanPackages'
import { getSession, useSession } from '@/features/auth/session'
import { api, API_BASE_URL } from '@/lib/api'

import {
  ApplicationContext,
  EMPTY_APPLICATION,
  FORM_FIELDS,
  type ActionResult,
  type ApplicationData,
  type BankLink,
  type KycState,
  type FormField,
  type SaveStatus,
  type SubmitResult,
  type UploadSlot,
} from './ApplicationContext'
import { isFinished, type ApplicationStatus, type StatusSummary } from './status'

type ServerApplication = {
  id: string
  reference: string
  loanPackage: LoanPackageId
  status: ApplicationStatus
  summary: StatusSummary | null
  data: Partial<Record<FormField, string>> & { kyc?: KycState | null; bank?: BankLink | null }
  consent: boolean
  documents: Array<{ slot: UploadSlot; fileName: string; size: number }>
  startedAt: string
  updatedAt: string
  submittedAt: string | null
}

const SAVE_DELAY_MS = 700

const fromServer = (app: ServerApplication): ApplicationData => ({
  ...EMPTY_APPLICATION,
  ...Object.fromEntries(FORM_FIELDS.map((field) => [field, app.data?.[field] ?? ''])),
  id: app.id,
  reference: app.reference,
  status: app.status,
  summary: app.summary,
  loanPackage: app.loanPackage,
  kyc: app.data?.kyc ?? null,
  bank: app.data?.bank ?? null,
  consent: app.consent,
  uploads: Object.fromEntries(app.documents.map((doc) => [doc.slot, { name: doc.fileName, size: doc.size }])),
  startedAt: app.startedAt,
  updatedAt: app.updatedAt,
  submittedAt: app.submittedAt,
})

const formFieldsOf = (data: ApplicationData) =>
  Object.fromEntries(FORM_FIELDS.map((field) => [field, data[field]])) as Record<FormField, string>

function ServerApplicationProvider({ owner, children }: { owner: string | null; children: ReactNode }) {
  const [data, setData] = useState<ApplicationData>(EMPTY_APPLICATION)
  const [loading, setLoading] = useState(Boolean(owner))
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const latest = useRef(data)
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    latest.current = data
  }, [data])

  useEffect(() => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('ippis-loan-application-draft'))
        .forEach((key) => localStorage.removeItem(key))
    } catch {}
    if (!owner) return

    let cancelled = false
    const load = () =>
      api<ServerApplication[]>('/portal/applications', { auth: true }).then((result) => {
        if (cancelled || dirty.current) return
        const list = result.payload ?? []
        const current = list.find((app) => app.status === 'draft') ?? list.find((app) => !isFinished(app.status)) ?? list[0]
        if (current) setData(fromServer(current))
        setLoading(false)
      })
    const onFocus = () => {
      if (latest.current.status && latest.current.status !== 'draft') load()
    }

    load()
    window.addEventListener('focus', onFocus)
    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
    }
  }, [owner])

  const save = useCallback(async () => {
    const current = latest.current
    if (!current.id || current.status !== 'draft' || !dirty.current) return true
    dirty.current = false
    setSaveStatus('saving')
    const result = await api(`/portal/applications/${current.id}`, {
      method: 'PATCH',
      body: { data: formFieldsOf(current), consent: current.consent },
      auth: true,
    })
    if (!result.ok) {
      dirty.current = true
      setSaveStatus('error')
      return false
    }
    setSaveStatus('saved')
    setData((prev) => ({ ...prev, updatedAt: new Date().toISOString() }))
    return true
  }, [])

  const flush = useCallback(async () => {
    clearTimeout(timer.current)
    return save()
  }, [save])

  useEffect(() => {
    const onPageHide = () => {
      const current = latest.current
      const token = getSession()?.token
      if (!dirty.current || !current.id || !token) return
      fetch(`${API_BASE_URL}/portal/applications/${current.id}`, {
        method: 'PATCH',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: formFieldsOf(current), consent: current.consent }),
      })
    }
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [])

  const update = useCallback(
    (patch: Partial<Record<FormField, string>> & { consent?: boolean }) => {
      dirty.current = true
      setSaveStatus('saving')
      setData((prev) => ({ ...prev, ...patch }))
      clearTimeout(timer.current)
      timer.current = setTimeout(save, SAVE_DELAY_MS)
    },
    [save],
  )

  const start = useCallback(async (loanPackage: LoanPackageId) => {
    const result = await api<ServerApplication>('/portal/applications', { body: { loanPackage }, auth: true })
    if (!result.ok || !result.payload) return result.message
    setData(fromServer(result.payload))
    return null
  }, [])

  const uploadDocument = useCallback(async (slot: UploadSlot, file: File) => {
    const id = latest.current.id
    const token = getSession()?.token
    if (!id || !token) return 'Please start your application first.'

    const form = new FormData()
    form.append('slot', slot)
    form.append('file', file)
    try {
      const response = await fetch(`${API_BASE_URL}/portal/applications/${id}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const json = await response.json().catch(() => null)
      if (!response.ok || json?.status !== true) return json?.message ?? 'Upload failed. Please try again.'
      setData((prev) => ({
        ...prev,
        uploads: { ...prev.uploads, [slot]: { name: json.payload.fileName, size: json.payload.size } },
      }))
      return null
    } catch {
      return "We couldn't reach the server. Check your connection and try again."
    }
  }, [])

  const removeDocument = useCallback(async (slot: UploadSlot) => {
    const id = latest.current.id
    if (!id) return null
    const result = await api(`/portal/applications/${id}/documents/${slot}`, { method: 'DELETE', auth: true })
    if (!result.ok) return result.message
    setData((prev) => {
      const uploads = { ...prev.uploads }
      delete uploads[slot]
      return { ...prev, uploads }
    })
    return null
  }, [])

  const submit = useCallback(async (): Promise<SubmitResult> => {
    if (!(await flush())) return { ok: false, message: "We couldn't save your latest changes. Please try again." }
    const id = latest.current.id
    if (!id) return { ok: false, message: 'Please start your application first.' }

    const result = await api<ServerApplication & { step?: string }>(`/portal/applications/${id}/submit`, {
      method: 'POST',
      auth: true,
    })
    if (result.ok && result.payload) {
      setData(fromServer(result.payload))
      return { ok: true, message: result.message }
    }
    return { ok: false, message: result.message, step: result.payload?.step }
  }, [flush])

  const runAction = useCallback(async (path: string, body: Record<string, unknown>): Promise<ActionResult> => {
    if (!(await flush())) return { ok: false, message: "We couldn't save your latest changes. Please try again." }
    const id = latest.current.id
    if (!id) return { ok: false, message: 'Please start your application first.' }
    const result = await api<ServerApplication & { field?: string }>(`/portal/applications/${id}/${path}`, { method: 'POST', auth: true, body })
    if (result.ok && result.payload) {
      setData(fromServer(result.payload))
      return { ok: true, message: result.message }
    }
    const fresh = await api<ServerApplication>(`/portal/applications/${id}`, { auth: true })
    if (fresh.ok && fresh.payload) setData(fromServer(fresh.payload))
    return { ok: false, message: result.message, field: result.payload?.field }
  }, [flush])

  const verifyBvn = useCallback((bvn: string, nin: string) => runAction('kyc/bvn', { bvn, nin }), [runAction])

  const linkBank = useCallback(
    (options?: { mismatch?: boolean }) => runAction('bank/simulate', { mismatch: options?.mismatch === true }),
    [runAction],
  )

  const value = useMemo(
    () => ({ data, loading, saveStatus, update, start, uploadDocument, removeDocument, flush, submit, verifyBvn, linkBank }),
    [data, loading, saveStatus, update, start, uploadDocument, removeDocument, flush, submit, verifyBvn, linkBank],
  )

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const owner = useSession()?.customer.id ?? null
  return (
    <ServerApplicationProvider key={owner ?? 'guest'} owner={owner}>
      {children}
    </ServerApplicationProvider>
  )
}
