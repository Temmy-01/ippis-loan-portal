import { createContext, useContext } from 'react'

import type { LoanPackageId } from '@/data/loanPackages'

export type UploadedDocument = { name: string; size: number }

export type UploadSlot = 'workId' | 'passport' | 'signature' | 'other'

export type ApplicationData = {
  loanPackage: LoanPackageId | null

  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  state: string
  address: string

  employer: string

  ippisNumber: string

  amount: string
  purpose: string
  repaymentPeriod: string

  uploads: Partial<Record<UploadSlot, UploadedDocument>>

  consent: boolean
  startedAt: string | null
  updatedAt: string | null
  submittedAt: string | null
}

export const EMPTY_APPLICATION: ApplicationData = {
  loanPackage: null,
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
  uploads: {},
  consent: false,
  startedAt: null,
  updatedAt: null,
  submittedAt: null,
}

export type SaveStatus = 'saved' | 'saving'

type ApplicationContextValue = {
  data: ApplicationData
  saveStatus: SaveStatus
  update: (patch: Partial<ApplicationData>) => void
  reset: () => void
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function useApplication() {
  const value = useContext(ApplicationContext)
  if (!value) throw new Error('useApplication must be used inside <ApplicationProvider>')
  return value
}
