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
    name: 'Public Sector Loan',
    shortName: 'Public Sector Loan',
    description: 'Designed for eligible public-sector employees and staff officers.',
    available: true,
  },
  {
    id: 'private',
    name: 'Private Sector Loan',
    shortName: 'Private Sector Loan',
    description: 'SME, auto and employee loans for private-sector customers and businesses.',
    available: true,
  },
]

export const getLoanPackage = (id: LoanPackageId | null) => LOAN_PACKAGES.find((item) => item.id === id) ?? LOAN_PACKAGES[0]
