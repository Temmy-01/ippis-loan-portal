import { Field, SelectInput, TextInput } from '@/components/apply/FormField'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { isBusinessProduct, productName, REGULATORY_BODIES, REPAYMENT_SOURCES } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'
import { useStepNav } from '@/features/application/useStepNav'
import { cn } from '@/lib/cn'

const forBusiness = (message: string) => (value: string, data: { productCode: string }) =>
  isBusinessProduct(data.productCode) && !value.trim() ? message : undefined

export default function BusinessStep() {
  const { goNext } = useStepNav('business')
  const { data, validate, field } = useStepErrors({
    repaymentSource: required('Select how you will repay the loan'),
    businessName: forBusiness('Enter your business name'),
    yearsOfExistence: forBusiness('Enter how many years your business has existed'),
    rcNumber: forBusiness('Enter your RC / CAC registration number'),
    regulatoryBody: forBusiness('Select your regulatory body'),
    confirmedStaff: (value, current) => (!isBusinessProduct(current.productCode) && !value ? 'Tell us if you are a confirmed staff' : undefined),
  })

  const business = isBusinessProduct(data.productCode)
  const repaymentSource = field('repaymentSource')
  const businessName = field('businessName')
  const yearsOfExistence = field('yearsOfExistence')
  const rcNumber = field('rcNumber')
  const regulatoryBody = field('regulatoryBody')
  const confirmedStaff = field('confirmedStaff')
  const position = field('position')

  return (
    <StepPage slug="business" onContinue={() => validate() && goNext()}>
      <StepCard className="sm:pb-[51px]">
        <p className="mb-5 font-inter text-[14px] text-app-muted">
          For your <strong className="text-app-ink">{productName(data.productCode) || 'loan'}</strong>.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="How will you repay the loan?" error={repaymentSource.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select" options={REPAYMENT_SOURCES} value={repaymentSource.value} onValueChange={repaymentSource.onValueChange} />
            )}
          </Field>

          {business ? (
            <>
              <Field label="Business name" error={businessName.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="organization" value={businessName.value} onValueChange={businessName.onValueChange} />
                )}
              </Field>
              <Field label="Years in business" error={yearsOfExistence.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} inputMode="numeric" aria-describedby={describedBy} invalid={invalid} placeholder="e.g. 3" value={yearsOfExistence.value} onValueChange={(value) => yearsOfExistence.onValueChange(value.replace(/\D/g, '').slice(0, 3))} />
                )}
              </Field>
              <Field label="RC / CAC registration number" error={rcNumber.error}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="e.g. RC1234567" value={rcNumber.value} onValueChange={(value) => rcNumber.onValueChange(value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20))} />
                )}
              </Field>
              <Field label="Regulatory body" error={regulatoryBody.error}>
                {({ id, describedBy, invalid }) => (
                  <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select" options={REGULATORY_BODIES} value={regulatoryBody.value} onValueChange={regulatoryBody.onValueChange} />
                )}
              </Field>
            </>
          ) : (
            <>
              <Field label="Are you a confirmed staff?" error={confirmedStaff.error}>
                {() => (
                  <div role="radiogroup" className="flex gap-3">
                    {(['yes', 'no'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={confirmedStaff.value === option}
                        onClick={() => confirmedStaff.onValueChange(option)}
                        className={cn(
                          'h-[49px] flex-1 rounded-[10px] border font-inter text-[15px] font-bold transition-colors',
                          confirmedStaff.value === option ? 'border-lms-purple bg-lilac-soft/50 text-lms-purple' : 'border-[#d9d5dc] bg-white text-app-ink',
                        )}
                      >
                        {option === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                )}
              </Field>
              <Field label="Position (optional)">
                {({ id, describedBy }) => (
                  <TextInput id={id} aria-describedby={describedBy} placeholder="e.g. Accountant" value={position.value} onValueChange={position.onValueChange} />
                )}
              </Field>
            </>
          )}
        </div>
      </StepCard>
    </StepPage>
  )
}
