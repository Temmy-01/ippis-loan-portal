import { useNavigate } from 'react-router-dom'

import { Field, SelectInput } from '@/components/apply/FormField'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { EMPLOYERS } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'

export default function EmploymentStep() {
  const navigate = useNavigate()
  const { validate, field } = useStepErrors({
    employer: required('Select your employer organization'),
  })

  const employer = field('employer')

  return (
    <StepPage index={1} onContinue={() => validate() && navigate('/apply/ippis')}>
      <StepCard className="sm:pb-[51px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Employer organization" error={employer.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select organization" options={EMPLOYERS} value={employer.value} onValueChange={employer.onValueChange} />
            )}
          </Field>
        </div>
      </StepCard>
    </StepPage>
  )
}
