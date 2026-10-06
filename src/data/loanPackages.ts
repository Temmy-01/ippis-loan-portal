export type LoanPackageId = 'ippis' | 'private'

export type LoanPackage = {
  id: LoanPackageId
  name: string
  shortName: string
  description: string
  available: boolean
}

export const LOAN_PACKAGES: LoanPackage[] = [
  {
    id: 'ippis',
    name: 'Public Sector — IPPIS Loan',
    shortName: 'IPPIS Loan',
    description: 'Designed for eligible public-sector employees receiving salaries through IPPIS.',
    available: true,
  },
  {
    id: 'private',
    name: 'Private Sector Loan',
    shortName: 'Private Sector Loan',
    description: 'Loan solutions designed for eligible private-sector employees.',
    available: false,
  },
]

export const getLoanPackage = (id: LoanPackageId | null) => LOAN_PACKAGES.find((item) => item.id === id) ?? LOAN_PACKAGES[0]
