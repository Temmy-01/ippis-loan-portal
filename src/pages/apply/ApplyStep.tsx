import { Navigate, useParams } from 'react-router-dom'

import { useApplication } from '@/features/application/ApplicationContext'

import DocumentsStep from './DocumentsStep'
import EmploymentStep from './EmploymentStep'
import IppisStep from './IppisStep'
import LoanStep from './LoanStep'
import PersonalStep from './PersonalStep'
import ReviewStep from './ReviewStep'

const STEP_SCREENS = {
  personal: PersonalStep,
  employment: EmploymentStep,
  ippis: IppisStep,
  loan: LoanStep,
  documents: DocumentsStep,
  review: ReviewStep,
}

export default function ApplyStep() {
  const { step = '' } = useParams()
  const { data } = useApplication()
  if (!data.loanPackage && !data.startedAt) return <Navigate to="/loan-packages" replace />
  const Screen = STEP_SCREENS[step as keyof typeof STEP_SCREENS]
  if (!Screen) return <Navigate to="/apply/personal" replace />
  return <Screen key={step} />
}
