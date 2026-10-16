import { Field, SelectInput, TextInput } from '@/components/apply/FormField'
import { PhoneVerify } from '@/components/apply/PhoneVerify'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { GENDERS, NIGERIAN_STATES } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'
import { useStepNav } from '@/features/application/useStepNav'
import { isEmail, isPhone } from '@/lib/validators'

const TODAY = new Date().toISOString().slice(0, 10)

export default function PersonalStep() {
  const { goNext } = useStepNav('personal')
  const { data, validate, field } = useStepErrors({
    fullName: required('Enter your full name'),
    dateOfBirth: required('Enter your date of birth'),
    phone: (value, current) =>
      !isPhone(value)
        ? 'Enter an 11-digit phone number, e.g. 08012345678'
        : current.verifiedPhone !== value
          ? 'Tap Verify to confirm your phone number before you continue'
          : undefined,
    email: (value) => (isEmail(value) ? undefined : 'Enter a valid email address'),
    state: required('Select your state of residence'),
    address: required('Enter your residential address'),
    phone2: (value) => (value && !isPhone(value) ? 'Enter an 11-digit phone number' : undefined),
    nokFirstName: (value, current) => (current.loanPackage === 'private' && !value.trim() ? "Enter your next of kin's first name" : undefined),
    nokLastName: (value, current) => (current.loanPackage === 'private' && !value.trim() ? "Enter your next of kin's last name" : undefined),
    nokPhone: (value, current) => (current.loanPackage === 'private' && !isPhone(value) ? "Enter your next of kin's 11-digit phone number" : undefined),
  })
  const isPrivate = data.loanPackage === 'private'
  const phone2 = field('phone2')
  const nokFirstName = field('nokFirstName')
  const nokLastName = field('nokLastName')
  const nokPhone = field('nokPhone')
  const digits = (value: string) => value.replace(/\D/g, '').slice(0, 11)

  const fullName = field('fullName')
  const dateOfBirth = field('dateOfBirth')
  const gender = field('gender')
  const phone = field('phone')
  const email = field('email')
  const state = field('state')
  const address = field('address')

  return (
    <StepPage slug="personal" onContinue={() => validate() && goNext()}>
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
          <PhoneVerify value={phone.value} error={phone.error} onChange={phone.onValueChange} />
          <Field label="Email address" hint="This is the email on your account." error={email.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} type="email" locked aria-describedby={describedBy} invalid={invalid} value={email.value} onValueChange={() => {}} />
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
          {isPrivate && (
            <>
              <Field label="Phone number 2 (optional)" error={phone2.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} type="tel" inputMode="numeric" aria-describedby={describedBy} invalid={invalid} placeholder="08012345678" value={phone2.value} onValueChange={(value) => phone2.onValueChange(digits(value))} />
                )}
              </Field>
              <div className="md:col-span-2 border-t border-app-line pt-5">
                <p className="font-inter text-[15px] font-bold text-app-ink">Next of kin</p>
              </div>
              <Field label="First name" error={nokFirstName.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} value={nokFirstName.value} onValueChange={nokFirstName.onValueChange} />
                )}
              </Field>
              <Field label="Last name" error={nokLastName.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} value={nokLastName.value} onValueChange={nokLastName.onValueChange} />
                )}
              </Field>
              <Field label="Phone number" error={nokPhone.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} type="tel" inputMode="numeric" aria-describedby={describedBy} invalid={invalid} placeholder="08012345678" value={nokPhone.value} onValueChange={(value) => nokPhone.onValueChange(digits(value))} />
                )}
              </Field>
            </>
          )}
        </div>
      </StepCard>
    </StepPage>
  )
}
