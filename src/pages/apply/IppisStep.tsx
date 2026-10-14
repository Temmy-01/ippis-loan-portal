import infoIppis from '@/assets/apply/info-ippis.svg'
import { Field, TextInput } from '@/components/apply/FormField'
import { InfoBox } from '@/components/apply/InfoBox'
import { EMPLOYER_IPPIS_PREFIX, IPPIS_MAX_LENGTH, ippisError } from '@/data/applicationOptions'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepErrors } from '@/features/application/useStepErrors'
import { useStepNav } from '@/features/application/useStepNav'

export default function IppisStep() {
  const { goNext } = useStepNav('staff-id')
  const { flush, data } = useApplication()
  const prefix = EMPLOYER_IPPIS_PREFIX[data.employer]
  const { validate, field } = useStepErrors({
    ippisNumber: (value) => ippisError(value, data.employer),
  })

  const ippis = field('ippisNumber')

  const handleContinue = async () => {
    if (!validate()) return
    await flush()
    goNext()
  }

  return (
    <StepPage slug="staff-id" onContinue={handleContinue}>
      <StepCard>
        <InfoBox icon={infoIppis} iconWidth={20} title="Where can I find my Staff Identity number?" className="mb-10">
          Check an official payroll record or contact your employer's payroll team. Do not guess this number.
        </InfoBox>
        <div className="grid grid-cols-1 items-start gap-5 pb-5 md:grid-cols-2">
          <Field label="Staff Identity number" hint={prefix ? `Starts with ${prefix}, up to ${IPPIS_MAX_LENGTH} characters` : `Up to ${IPPIS_MAX_LENGTH} characters, exactly as on your record`} error={ippis.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" placeholder={prefix ? `${prefix}0000000` : 'Enter your number'} maxLength={IPPIS_MAX_LENGTH} value={ippis.value} onValueChange={(value) => ippis.onValueChange(value.toUpperCase())} />
            )}
          </Field>
        </div>
      </StepCard>
    </StepPage>
  )
}
