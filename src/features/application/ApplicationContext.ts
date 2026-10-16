import { createContext, useContext } from 'react'

import type { LoanPackageId } from '@/data/loanPackages'

import type { ApplicationStatus, StatusSummary } from './status'

export type UploadedDocument = { name: string; size: number }

export type UploadSlot = 'workId' | 'passport' | 'meansOfId' | 'cac' | 'face'

export type KycState = { verified: boolean; ninStatus: 'matched' | 'mismatch' | 'unavailable' | null; checksLeft: number }

export const MAX_FACE_CHECKS = 3

export type FaceCheck = { matched: boolean; confidence: number | null; attemptsLeft: number }

export type BankLink = { provider: string; bankName: string; accountName: string; accountNumber: string; linkedAt: string }

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
  'phone2',
  'nokFirstName',
  'nokLastName',
  'nokPhone',
  'productCode',
  'repaymentSource',
  'confirmedStaff',
  'position',
  'businessName',
  'yearsOfExistence',
  'rcNumber',
  'regulatoryBody',
  'bvn',
  'nin',
  'idType',
] as const

export type FormField = (typeof FORM_FIELDS)[number]

export type ApplicationData = Record<FormField, string> & {
  id: string | null
  reference: string | null
  status: ApplicationStatus | null
  summary: StatusSummary | null
  loanPackage: LoanPackageId | null
  kyc: KycState | null
  bank: BankLink | null
  verifiedPhone: string | null
  faceCheck: FaceCheck
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
  phone2: '',
  nokFirstName: '',
  nokLastName: '',
  nokPhone: '',
  productCode: '',
  repaymentSource: '',
  confirmedStaff: '',
  position: '',
  businessName: '',
  yearsOfExistence: '',
  rcNumber: '',
  regulatoryBody: '',
  bvn: '',
  nin: '',
  idType: '',
  kyc: null,
  verifiedPhone: null,
  faceCheck: { matched: false, confidence: null, attemptsLeft: MAX_FACE_CHECKS },
  bank: null,
  id: null,
  reference: null,
  status: null,
  summary: null,
  loanPackage: null,
  uploads: {},
  consent: false,
  startedAt: null,
  updatedAt: null,
  submittedAt: null,
}

export type SaveStatus = 'saved' | 'saving' | 'error'

export type SubmitResult = { ok: boolean; message: string; step?: string }

export type ActionResult = { ok: boolean; message: string; field?: string }

type ApplicationContextValue = {
  data: ApplicationData
  loading: boolean
  saveStatus: SaveStatus
  update: (patch: Partial<Record<FormField, string>> & { consent?: boolean }) => void
  start: (loanPackage: LoanPackageId) => Promise<string | null>
  switchPackage: (loanPackage: LoanPackageId) => Promise<string | null>
  uploadDocument: (slot: UploadSlot, file: File) => Promise<string | null>
  removeDocument: (slot: UploadSlot) => Promise<string | null>
  flush: () => Promise<boolean>
  submit: () => Promise<SubmitResult>
  verifyBvn: (bvn: string, nin: string) => Promise<ActionResult>
  linkBank: (options?: { mismatch?: boolean }) => Promise<ActionResult>
  sendPhoneCode: (phone: string) => Promise<ActionResult>
  confirmPhoneCode: (code: string) => Promise<ActionResult>
  checkFace: (photo: File) => Promise<ActionResult>
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function useApplication() {
  const value = useContext(ApplicationContext)
  if (!value) throw new Error('useApplication must be used inside <ApplicationProvider>')
  return value
}
