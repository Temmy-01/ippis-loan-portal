import { useNavigate } from 'react-router-dom'

import { Field, SelectInput, TextInput } from '@/components/apply/FormField'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { GENDERS, NIGERIAN_STATES } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'
import { isEmail, isPhone } from '@/lib/validators'

const TODAY = new Date().toISOString().slice(0, 10)

export default function PersonalStep() {
  const navigate = useNavigate()
  const { validate, field } = useStepErrors({
    fullName: required('Enter your full name'),
    dateOfBirth: required('Enter your date of birth'),
    phone: (value) => (isPhone(value) ? undefined : 'Enter a valid phone number'),
    email: (value) => (isEmail(value) ? undefined : 'Enter a valid email address'),
    state: required('Select your state of residence'),
    address: required('Enter your residential address'),
  })

  const fullName = field('fullName')
  const dateOfBirth = field('dateOfBirth')
  const gender = field('gender')
  const phone = field('phone')
  const email = field('email')
  const state = field('state')
  const address = field('address')

  return (
    <StepPage index={0} onContinue={() => validate() && navigate('/apply/employment')}>
      <StepCard className="sm:pb-[51px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Full name" error={fullName.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="name" placeholder="Adaeze Okafor" value={fullName.value} onValueChange={fullName.onValueChange} />
            )}
          </Field>
          <Field label="Date of birth" error={dateOfBirth.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                type="date"
                lang="en-GB"
                aria-describedby={describedBy}
                invalid={invalid}
                autoComplete="bday"
                max={TODAY}
                value={dateOfBirth.value}
                onValueChange={dateOfBirth.onValueChange}
                className="cursor-text"
              />
            )}
          </Field>
          <Field label="Gender (if required)" error={gender.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select" options={GENDERS} value={gender.value} onValueChange={gender.onValueChange} />
            )}
          </Field>
          <Field label="Phone number" error={phone.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} type="tel" inputMode="tel" aria-describedby={describedBy} invalid={invalid} autoComplete="tel" placeholder="080 1234 5678" value={phone.value} onValueChange={phone.onValueChange} />
            )}
          </Field>
          <Field label="Email address" error={email.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} type="email" aria-describedby={describedBy} invalid={invalid} autoComplete="email" placeholder="ada@example.com" value={email.value} onValueChange={email.onValueChange} />
            )}
          </Field>
          <Field label="State of residence" error={state.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select state" options={NIGERIAN_STATES} value={state.value} onValueChange={state.onValueChange} />
            )}
          </Field>
          <Field label="Residential address" error={address.error} className="md:col-span-2">
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="street-address" placeholder="Enter your current home address" value={address.value} onValueChange={address.onValueChange} />
            )}
          </Field>
        </div>
      </StepCard>
    </StepPage>
  )
}
