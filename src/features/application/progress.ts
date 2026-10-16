import type { ApplicationData } from './ApplicationContext'
import { stepsFor, type StepSlug } from './steps'
import { isBusinessProduct, uploadSlotsFor } from '@/data/applicationOptions'
import { isEmail, isPhone } from '@/lib/validators'

const filled = (...values: string[]) => values.every((value) => value.trim() !== '')

const isPrivate = (data: ApplicationData) => data.loanPackage === 'private'

const STEP_DONE: Record<StepSlug, (data: ApplicationData) => boolean> = {
  personal: (data) =>
    filled(data.fullName, data.dateOfBirth, data.state, data.address) &&
    isPhone(data.phone) &&
    data.verifiedPhone === data.phone &&
    isEmail(data.email) &&
    (!isPrivate(data) || (filled(data.nokFirstName, data.nokLastName) && isPhone(data.nokPhone))),
  employment: (data) => filled(data.employer),
  'staff-id': (data) => filled(data.ippisNumber),
  loantype: (data) => filled(data.productCode),
  loan: (data) => filled(data.amount, data.purpose) && (!isPrivate(data) || filled(data.repaymentPeriod)),
  business: (data) =>
    isBusinessProduct(data.productCode)
      ? filled(data.repaymentSource, data.businessName, data.yearsOfExistence, data.rcNumber, data.regulatoryBody)
      : filled(data.repaymentSource, data.confirmedStaff),
  identity: (data) => Boolean(data.kyc?.verified),
  documents: (data) => filled(data.idType) && uploadSlotsFor(data.loanPackage, data.productCode).every(({ slot }) => data.uploads[slot]),
  bank: (data) => Boolean(data.bank),
  face: (data) => data.faceCheck.matched && Boolean(data.uploads.face),
  review: (data) => Boolean(data.submittedAt),
}

export const isStepDone = (slug: StepSlug, data: ApplicationData) => STEP_DONE[slug](data)

export function getProgress(data: ApplicationData) {
  const steps = stepsFor(data.loanPackage)
  const done = steps.map((step) => STEP_DONE[step.slug](data))
  const completedSteps = done.filter(Boolean).length
  const nextIndex = done.indexOf(false)
  const nextStep = nextIndex === -1 ? null : steps[nextIndex]

  return {
    started: Boolean(data.startedAt),
    submitted: Boolean(data.submittedAt),
    completedSteps,
    totalSteps: steps.length,
    percent: Math.round((completedSteps / steps.length) * 100),
    detailsComplete: done.slice(0, -1).every(Boolean),
    nextStepLabel: nextStep?.label ?? 'Track your application',
    nextStepPath: nextStep ? `/apply/${nextStep.slug}` : '/track',
  }
}
