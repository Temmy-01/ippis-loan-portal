import { createContext, useContext } from 'react'

export type UploadedDocument = { type: string; name: string; size: number }

export type ApplicationData = {
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  state: string
  address: string

  employer: string
  mda: string
  employmentStatus: string
  staffNumber: string
  designation: string
  workLocation: string

  ippisNumber: string
  payrollId: string

  amount: string
  purpose: string
  repaymentPeriod: string

  documentType: string
  documents: UploadedDocument[]

  consent: boolean
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
  mda: '',
  employmentStatus: '',
  staffNumber: '',
  designation: '',
  workLocation: '',
  ippisNumber: '',
  payrollId: '',
  amount: '',
  purpose: '',
  repaymentPeriod: '',
  documentType: '',
  documents: [],
  consent: false,
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
