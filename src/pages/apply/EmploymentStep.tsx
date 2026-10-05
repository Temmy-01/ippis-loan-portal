import { useNavigate } from 'react-router-dom'

import { Field, SelectInput, TextInput } from '@/components/apply/FormField'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { EMPLOYMENT_STATUSES, INSTITUTIONS, MDAS } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'

export default function EmploymentStep() {
  const navigate = useNavigate()
  const { validate, field } = useStepErrors({
    employer: required('Enter your employer or institution'),
    mda: required('Enter your ministry, department or agency'),
    employmentStatus: required('Select your employment status'),
    designation: required('Enter your job title'),
    workLocation: required('Enter your work location'),
  })

  const employer = field('employer')
  const mda = field('mda')
  const status = field('employmentStatus')
  const staffNumber = field('staffNumber')
  const designation = field('designation')
  const workLocation = field('workLocation')

  return (
    <StepPage index={1} onContinue={() => validate() && navigate('/apply/ippis')}>
      <StepCard className="sm:pb-[51px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Employer or government institution" error={employer.error}>
            {({ id, describedBy, invalid }) => (
              <>
                <TextInput id={id} list="institutions" aria-describedby={describedBy} invalid={invalid} autoComplete="organization" placeholder="Search institution" value={employer.value} onValueChange={employer.onValueChange} />
                <datalist id="institutions">
                  {INSTITUTIONS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </>
            )}
          </Field>
          <Field label="Ministry, department or agency (MDA)" error={mda.error}>
            {({ id, describedBy, invalid }) => (
              <>
                <TextInput id={id} list="mdas" aria-describedby={describedBy} invalid={invalid} placeholder="Select MDA" value={mda.value} onValueChange={mda.onValueChange} />
                <datalist id="mdas">
                  {MDAS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </>
            )}
          </Field>
          <Field label="Employment status" error={status.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select status" options={EMPLOYMENT_STATUSES} value={status.value} onValueChange={status.onValueChange} />
            )}
          </Field>
          <Field label="Staff or employee number (if required)">
            {({ id, describedBy }) => (
              <TextInput id={id} aria-describedby={describedBy} placeholder="Enter staff number" value={staffNumber.value} onValueChange={staffNumber.onValueChange} />
            )}
          </Field>
          <Field label="Designation or job title" error={designation.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="organization-title" placeholder="Enter your job title" value={designation.value} onValueChange={designation.onValueChange} />
            )}
          </Field>
          <Field label="Work location" error={workLocation.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="City and state" value={workLocation.value} onValueChange={workLocation.onValueChange} />
            )}
          </Field>
        </div>
      </StepCard>
    </StepPage>
  )
}
