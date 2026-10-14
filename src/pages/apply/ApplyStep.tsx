import { Navigate, useParams } from 'react-router-dom'

import { useApplication } from '@/features/application/ApplicationContext'
import { isSubmitted } from '@/features/application/status'
import { stepsFor } from '@/features/application/steps'

import BankStep from './BankStep'
import BusinessStep from './BusinessStep'
import DocumentsStep from './DocumentsStep'
import EmploymentStep from './EmploymentStep'
import FaceStep from './FaceStep'
import IdentityStep from './IdentityStep'
import IppisStep from './IppisStep'
import LoanStep from './LoanStep'
import LoanTypeStep from './LoanTypeStep'
import PersonalStep from './PersonalStep'
import ReviewStep from './ReviewStep'

const STEP_SCREENS = {
  personal: PersonalStep,
  employment: EmploymentStep,
  'staff-id': IppisStep,
  loan: LoanStep,
  documents: DocumentsStep,
  loantype: LoanTypeStep,
  business: BusinessStep,
  identity: IdentityStep,
  bank: BankStep,
  face: FaceStep,
  review: ReviewStep,
}

export default function ApplyStep() {
  const { step = '' } = useParams()
  const { data, loading } = useApplication()
  if (loading) return null
  if (isSubmitted(data.status)) return <Navigate to="/application-submitted" replace />
  if (!data.id) return <Navigate to="/loan-packages" replace />
  if (step === 'ippis') return <Navigate to="/apply/staff-id" replace />
  const steps = stepsFor(data.loanPackage)
  const Screen = STEP_SCREENS[step as keyof typeof STEP_SCREENS]
  if (!Screen || !steps.some((item) => item.slug === step)) return <Navigate to={`/apply/${steps[0].slug}`} replace />
  return <Screen key={step} />
}
