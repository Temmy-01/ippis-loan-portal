import infoLoan from '@/assets/apply/info-loan.svg'
import { Field, SelectInput, TextInput } from '@/components/apply/FormField'
import { InfoBox } from '@/components/apply/InfoBox'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { LOAN_PURPOSES, REPAYMENT_PERIODS } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'
import { useStepNav } from '@/features/application/useStepNav'

const formatAmount = (digits: string) => (digits ? `₦ ${Number(digits).toLocaleString('en-NG')}` : '')

export default function LoanStep() {
  const { goNext } = useStepNav('loan')
  const { data, validate, field } = useStepErrors({
    amount: (value) => (!value || Number(value) <= 0 ? 'Enter the amount you would like to request' : undefined),
    purpose: required('Select a loan purpose'),
    repaymentPeriod: (value, current) => (current.loanPackage === 'private' && !value ? 'Select your loan tenor' : undefined),
  })
  const isPrivate = data.loanPackage === 'private'
  const months = parseInt(data.repaymentPeriod, 10)
  const principalPerMonth = isPrivate && Number(data.amount) > 0 && months > 0 ? Math.ceil(Number(data.amount) / months) : 0

  const amount = field('amount')
  const purpose = field('purpose')
  const period = field('repaymentPeriod')

  return (
    <StepPage slug="loan" onContinue={() => validate() && goNext()}>
      <StepCard>
        <div className="grid grid-cols-1 items-start gap-5 pb-5 md:grid-cols-2">
          <Field label="How much do you need?" hint={amount.error ? undefined : 'Enter the amount you would like to request'} error={amount.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                inputMode="numeric"
                aria-describedby={describedBy}
                invalid={invalid}
                placeholder="₦ 0.00"
                value={formatAmount(amount.value)}
                onValueChange={(value) => amount.onValueChange(value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10))}
              />
            )}
          </Field>
          <Field label="Loan purpose" error={purpose.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select a purpose" options={LOAN_PURPOSES} value={purpose.value} onValueChange={purpose.onValueChange} />
            )}
          </Field>
          <Field label="Loan Tenor" error={period.error}>
            {({ id, describedBy, invalid }) => (
              <SelectInput id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Select available period" options={REPAYMENT_PERIODS} value={period.value} onValueChange={period.onValueChange} />
            )}
          </Field>
          {principalPerMonth > 0 && (
            <div className="rounded-[12px] bg-lilac-soft px-4 py-3">
              <p className="font-inter text-[13px] text-app-muted">Repayment estimate</p>
              <p className="font-inter text-[20px] leading-[28px] font-bold text-lms-purple">{formatAmount(String(principalPerMonth))} / month</p>
              <p className="font-inter text-[12px] text-app-muted">Principal only. Interest and fees are confirmed in your loan offer.</p>
            </div>
          )}
        </div>
        <InfoBox icon={infoLoan} iconWidth={16.05} className="mt-5 mb-5">
          Final rates, fees and repayment terms will only be shown when approved offer data is available. Submission
          does not guarantee approval.
        </InfoBox>
      </StepCard>
    </StepPage>
  )
}
