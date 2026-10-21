import { useState } from 'react'
import { LuShieldCheck } from 'react-icons/lu'

import { Field, TextInput } from '@/components/apply/FormField'
import { StepCard, StepPage } from '@/components/apply/StepPage'
import { useApplication } from '@/features/application/ApplicationContext'
import { useStepNav } from '@/features/application/useStepNav'

const digits = (value: string) => value.replace(/\D/g, '').slice(0, 11)

export default function IdentityStep() {
  const { goNext } = useStepNav('identity')
  const { data, update, verifyBvn } = useApplication()
  const [errors, setErrors] = useState<{ bvn?: string; nin?: string; form?: string }>({})
  const [checking, setChecking] = useState(false)
  const verified = Boolean(data.kyc?.verified)

  const handleContinue = async () => {
    if (verified) {
      goNext()
      return
    }
    const next: typeof errors = {}
    if (data.bvn.length !== 11) next.bvn = 'Enter your 11-digit BVN'
    if (data.nin.length !== 11) next.nin = 'Enter your 11-digit NIN'
    setErrors(next)
    if (Object.keys(next).length) return

    setChecking(true)
    const result = await verifyBvn(data.bvn, data.nin)
    setChecking(false)
    if (result.ok) {
      setErrors({})
      goNext()
      return
    }
    setErrors(result.field === 'nin' ? { nin: result.message } : result.field === 'bvn' ? { bvn: result.message } : { form: result.message })
  }

  return (
    <StepPage slug="identity" onContinue={handleContinue}>
      <StepCard className="sm:pb-[51px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="BVN" hint={errors.bvn ? undefined : 'Dial *565*0# on your registered phone to get your BVN'} error={errors.bvn}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                inputMode="numeric"
                autoComplete="off"
                aria-describedby={describedBy}
                invalid={invalid}
                locked={verified}
                placeholder="11-digit BVN"
                value={data.bvn}
                onValueChange={(value) => {
                  update({ bvn: digits(value) })
                  setErrors((prev) => ({ ...prev, bvn: undefined, form: undefined }))
                }}
              />
            )}
          </Field>
          <Field label="NIN" hint={errors.nin ? undefined : 'The 11-digit number on your NIN slip or NIMC app'} error={errors.nin}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                inputMode="numeric"
                autoComplete="off"
                aria-describedby={describedBy}
                invalid={invalid}
                locked={verified}
                placeholder="11-digit NIN"
                value={data.nin}
                onValueChange={(value) => {
                  update({ nin: digits(value) })
                  setErrors((prev) => ({ ...prev, nin: undefined, form: undefined }))
                }}
              />
            )}
          </Field>
        </div>

        <div className="mt-5" aria-live="polite">
          {checking ? (
            <p className="flex items-center gap-2 font-inter text-[14px] text-app-muted">
              <span className="anim-spin size-4 rounded-full border-2 border-lms-purple/30 border-t-lms-purple" /> Checking your BVN and NIN…
            </p>
          ) : verified ? (
            <p className="flex items-center gap-2 rounded-[12px] bg-[#e8f8f0] px-4 py-3 font-inter text-[14px] font-bold text-[#17724d]">
              <LuShieldCheck className="size-5" /> Your BVN and NIN are verified. They can no longer be changed on this application.
            </p>
          ) : (
            <p className="rounded-[12px] bg-sky-soft px-4 py-3 font-inter text-[14px] leading-[21px] text-sky-ink">
              Press Continue to verify. Your BVN and NIN are checked with your bank and NIMC, and both must be in the same name
              as your account. Once verified, they cannot be changed.{data.kyc && data.kyc.checksLeft < 5 ? ` ${data.kyc.checksLeft} checks left.` : ''}
            </p>
          )}
          {errors.form && (
            <p role="alert" className="mt-3 rounded-[12px] bg-[#fdeced] px-4 py-3 font-inter text-[14px] text-[#b4282d]">
              {errors.form}
            </p>
          )}
        </div>
      </StepCard>
    </StepPage>
  )
}
