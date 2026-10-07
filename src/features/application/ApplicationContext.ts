import { createContext, useContext } from 'react'

import type { LoanPackageId } from '@/data/loanPackages'

import type { ApplicationStatus, StatusSummary } from './status'

export type UploadedDocument = { name: string; size: number }

export type UploadSlot = 'workId' | 'passport' | 'signature' | 'other'

export type IdentityState = { status: 'required' | 'verified' | 'locked'; attemptsLeft: number }

export const FORM_FIELDS = [
  'fullName',
  'dateOfBirth',
  'gender',
  'phone',
  'email',
  'state',
  'address',
  'employer',
  'ippisNumber',
  'amount',
  'purpose',
  'repaymentPeriod',
] as const

export type FormField = (typeof FORM_FIELDS)[number]

export type ApplicationData = Record<FormField, string> & {
  id: string | null
  reference: string | null
  status: ApplicationStatus | null
  summary: StatusSummary | null
  identity: IdentityState | null
  loanPackage: LoanPackageId | null
  uploads: Partial<Record<UploadSlot, UploadedDocument>>
  consent: boolean
  startedAt: string | null
  updatedAt: string | null
  submittedAt: string | null
}

export const EMPTY_APPLICATION: ApplicationData = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  state: '',
  address: '',
  employer: '',
  ippisNumber: '',
  amount: '',
  purpose: '',
  repaymentPeriod: '',
  id: null,
  reference: null,
  status: null,
  summary: null,
  identity: null,
  loanPackage: null,
  uploads: {},
  consent: false,
  startedAt: null,
  updatedAt: null,
  submittedAt: null,
}

export type SaveStatus = 'saved' | 'saving' | 'error'

export type SubmitResult = { ok: boolean; message: string; step?: string }

export type VerifyResult = { ok: boolean; message: string; attemptsLeft?: number }

type ApplicationContextValue = {
  data: ApplicationData
  loading: boolean
  saveStatus: SaveStatus
  update: (patch: Partial<Record<FormField, string>> & { consent?: boolean }) => void
  start: (loanPackage: LoanPackageId) => Promise<string | null>
  uploadDocument: (slot: UploadSlot, file: File) => Promise<string | null>
  removeDocument: (slot: UploadSlot) => Promise<string | null>
  flush: () => Promise<boolean>
  submit: () => Promise<SubmitResult>
  verifyIdentity: (image: string) => Promise<VerifyResult>
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function useApplication() {
  const value = useContext(ApplicationContext)
  if (!value) throw new Error('useApplication must be used inside <ApplicationProvider>')
  return value
}
