import { useNavigate } from 'react-router-dom'

import { useApplication } from './ApplicationContext'
import { stepsFor, type StepSlug } from './steps'

export function useStepNav(slug: StepSlug) {
  const navigate = useNavigate()
  const { data } = useApplication()
  const steps = stepsFor(data.loanPackage)
  const index = steps.findIndex((step) => step.slug === slug)

  return {
    steps,
    index,
    step: steps[index],
    goNext: () => navigate(`/apply/${steps[index + 1]?.slug ?? 'review'}`),
    goBack: () => navigate(`/apply/${steps[index - 1]?.slug ?? steps[0].slug}`),
  }
}
