import type { ApplicationData } from './ApplicationContext'
import { APPLICATION_STEPS } from './steps'
import { REQUIRED_UPLOADS } from '@/data/applicationOptions'
import { isEmail, isPhone } from '@/lib/validators'

const filled = (...values: string[]) => values.every((value) => value.trim() !== '')

export function getProgress(data: ApplicationData) {
  const done = [
    filled(data.fullName, data.dateOfBirth, data.state, data.address) && isPhone(data.phone) && isEmail(data.email),
    filled(data.employer),
    filled(data.ippisNumber),
    filled(data.amount, data.purpose),
    REQUIRED_UPLOADS.every((slot) => data.uploads[slot]),
    Boolean(data.submittedAt),
  ]
  const completedSteps = done.filter(Boolean).length
  const nextIndex = done.indexOf(false)
  const nextStep = nextIndex === -1 ? null : APPLICATION_STEPS[nextIndex]

  return {
    started: Boolean(data.startedAt),
    submitted: Boolean(data.submittedAt),
    completedSteps,
    totalSteps: APPLICATION_STEPS.length,
    percent: Math.round((completedSteps / APPLICATION_STEPS.length) * 100),
    detailsComplete: done.slice(0, 5).every(Boolean),
    nextStepLabel: nextStep?.label ?? 'Track your application',
    nextStepPath: nextStep ? `/apply/${nextStep.slug}` : '/track',
  }
}
