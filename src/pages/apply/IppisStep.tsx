import { useNavigate } from 'react-router-dom'

import infoIppis from '@/assets/apply/info-ippis.svg'
import { Field, TextInput } from '@/components/apply/FormField'
import { InfoBox } from '@/components/apply/InfoBox'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepErrors } from '@/features/application/useStepErrors'

export default function IppisStep() {
  const navigate = useNavigate()
  const { flush } = useApplication()
  const { validate, field } = useStepErrors({
    ippisNumber: (value) =>
      value.trim() === '' ? 'Enter your IPPIS number' : /^[A-Za-z0-9-]{4,}$/.test(value.trim()) ? undefined : 'Check the number and try again',
  })

  const ippis = field('ippisNumber')

  const handleContinue = async () => {
    if (!validate()) return
    await flush()
    navigate('/apply/loan')
  }

  return (
    <StepPage index={2} onContinue={handleContinue}>
      <StepCard>
        <InfoBox icon={infoIppis} iconWidth={20} title="Where can I find my IPPIS number?" className="mb-10">
          Check an official payroll record or contact your employer's payroll team. Do not guess this number.
        </InfoBox>
        <div className="grid grid-cols-1 items-start gap-5 pb-5 md:grid-cols-2">
          <Field label="IPPIS number" hint="Enter the number exactly as it appears on your record" error={ippis.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" placeholder="Enter your IPPIS number" value={ippis.value} onValueChange={ippis.onValueChange} />
            )}
          </Field>
        </div>
      </StepCard>
    </StepPage>
  )
}
