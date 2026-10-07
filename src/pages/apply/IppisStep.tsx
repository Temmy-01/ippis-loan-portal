import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import infoIppis from '@/assets/apply/info-ippis.svg'
import { Field, TextInput } from '@/components/apply/FormField'
import { InfoBox } from '@/components/apply/InfoBox'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepErrors } from '@/features/application/useStepErrors'
import { api } from '@/lib/api'

export default function IppisStep() {
  const navigate = useNavigate()
  const { flush } = useApplication()
  const [checking, setChecking] = useState(false)
  const { validate, field, setErrors } = useStepErrors({
    ippisNumber: (value) =>
      value.trim() === '' ? 'Enter your IPPIS number' : /^[A-Za-z0-9-]{4,}$/.test(value.trim()) ? undefined : 'Check the number and try again',
  })

  const ippis = field('ippisNumber')

  const handleContinue = async () => {
    if (!validate() || checking) return
    setChecking(true)
    const result = await api('/portal/checks/ippis', { body: { ippisNumber: ippis.value.trim() }, auth: true })
    await flush()
    setChecking(false)
    if (result.ok) navigate('/apply/loan')
    else setErrors({ ippisNumber: result.message })
  }

  return (
    <StepPage index={2} onContinue={handleContinue}>
      <StepCard>
        <InfoBox icon={infoIppis} iconWidth={20} title="Where can I find my IPPIS number?" className="mb-10">
          Check an official payroll record or contact your employer's payroll team. Do not guess this number.
        </InfoBox>
        <div className="grid grid-cols-1 items-start gap-5 pb-5 md:grid-cols-2">
          <Field label="IPPIS number" hint={checking ? 'Checking your IPPIS number…' : 'Enter the number exactly as it appears on your record'} error={ippis.error}>
            {({ id, describedBy, invalid }) => (
              <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" placeholder="Enter your IPPIS number" value={ippis.value} onValueChange={ippis.onValueChange} />
            )}
          </Field>
        </div>
      </StepCard>
    </StepPage>
  )
}
