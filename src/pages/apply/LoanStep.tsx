import { useNavigate } from 'react-router-dom'

import infoLoan from '@/assets/apply/info-loan.svg'
import { Field, SelectInput, TextInput } from '@/components/apply/FormField'
import { InfoBox } from '@/components/apply/InfoBox'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { LOAN_PURPOSES, REPAYMENT_PERIODS } from '@/data/applicationOptions'
import { required, useStepErrors } from '@/features/application/useStepErrors'

const formatAmount = (digits: string) => (digits ? `₦ ${Number(digits).toLocaleString('en-NG')}` : '')

export default function LoanStep() {
  const navigate = useNavigate()
  const { validate, field } = useStepErrors({
    amount: (value) => (!value || Number(value) <= 0 ? 'Enter the amount you would like to request' : undefined),
    purpose: required('Select a loan purpose'),
  })

  const amount = field('amount')
  const purpose = field('purpose')
  const period = field('repaymentPeriod')

  return (
    <StepPage index={3} onContinue={() => validate() && navigate('/apply/documents')}>
      <StepCard>
        <div className="grid grid-cols-1 items-start gap-5 pb-5 md:grid-cols-2">
          <Field label="How much do you need" hint={amount.error ? undefined : 'Enter the amount you would like to request'} error={amount.error}>
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
          <Field label="Loan Tenor">
            {({ id, describedBy }) => (
              <SelectInput id={id} aria-describedby={describedBy} placeholder="Select available period" options={REPAYMENT_PERIODS} value={period.value} onValueChange={period.onValueChange} />
            )}
          </Field>
        </div>
        <InfoBox icon={infoLoan} iconWidth={16.05} className="mt-5 mb-5">
          Final rates, fees and repayment terms will only be shown when approved offer data is available. Submission
          does not guarantee approval.
        </InfoBox>
      </StepCard>
    </StepPage>
  )
}
