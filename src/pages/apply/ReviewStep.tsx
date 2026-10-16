import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'

import iconEdit from '@/assets/apply/icon-edit.svg'
import iconWarning from '@/assets/apply/icon-warning.svg'
import { LINK_BUTTON } from '@/components/apply/buttonStyles'
import { InfoBox } from '@/components/apply/InfoBox'
import { idTypeLabel, isBusinessProduct, productName, uploadSlotsFor } from '@/data/applicationOptions'
import { StepPage } from '@/components/apply/StepPage'
import { useApplication } from '@/features/application/ApplicationContext'
import { cn } from '@/lib/cn'
import { formatDate, formatNaira, maskNumber } from '@/lib/format'

type Item = { label: string; value: string; fallback?: string }

function Section({
  title,
  step,
  items,
  delay,
}: {
  title: string
  step: string
  items: Item[]
  delay: number
}) {
  const navigate = useNavigate()
  return (
    <section
      className="anim-fade-up flex flex-col gap-[15px] rounded-[14px] border border-app-line bg-white p-5 sm:p-[23px]"
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-inter text-[16px] leading-[24.8px] font-bold text-app-ink">{title}</h2>
        <button type="button" onClick={() => navigate(`/apply/${step}`)} className={cn(LINK_BUTTON, 'group -my-3')}>
          <img src={iconEdit} alt="" className="block size-5 transition-transform group-hover:-rotate-12" />
          Edit
        </button>
      </div>
      <dl className="grid grid-cols-1 gap-[15px] sm:grid-cols-3">
        {items.map(({ label, value, fallback }) => (
          <div key={label} className="min-w-0">
            <dt className="font-inter text-[12px] leading-[18.6px] text-app-muted">{label}</dt>
            <dd className="font-inter text-[16px] leading-[24.8px] font-bold break-words">
              {value || fallback ? (
                <span className="text-app-ink">{value || fallback}</span>
              ) : (
                <span className="font-normal text-app-muted">Not provided</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default function ReviewStep() {
  const navigate = useNavigate()
  const { data, update, submit } = useApplication()
  const [submitting, setSubmitting] = useState(false)
  const [problem, setProblem] = useState<{ message: string; step?: string } | null>(null)

  const contact = [data.email, data.phone].filter(Boolean).join(' · ')
  const isPrivate = data.loanPackage === 'private'

  const handleSubmit = async () => {
    if (!data.consent) return
    setProblem(null)
    setSubmitting(true)
    const result = await submit()
    setSubmitting(false)
    if (result.ok) {
      navigate('/application-submitted')
      return
    }
    setProblem({ message: result.message, step: result.step })
  }

  return (
    <StepPage slug="review" onContinue={handleSubmit} submit={{ label: 'Submit Application', enabled: data.consent, loading: submitting }}>
      <div className="flex flex-col gap-[14px] pt-4">
        <Section
          title="Personal Information"
          step="personal"
          delay={60}
          items={[
            { label: 'Full name', value: data.fullName },
            { label: 'Date of birth', value: formatDate(data.dateOfBirth) },
            { label: 'Contact', value: contact },
            ...(isPrivate
              ? [
                  { label: 'Phone number 2', value: data.phone2, fallback: 'None' },
                  { label: 'Next of kin', value: [data.nokFirstName, data.nokLastName].filter(Boolean).join(' ') },
                  { label: 'Next of kin phone', value: data.nokPhone },
                ]
              : []),
          ]}
        />
        {isPrivate ? (
          <Section title="Loan Type" step="loantype" delay={100} items={[{ label: 'Loan type', value: productName(data.productCode) }]} />
        ) : (
          <>
            <Section title="Employment Information" step="employment" delay={120} items={[{ label: 'Employer organization', value: data.employer }]} />
            <Section title="Staff Identity Information" step="staff-id" delay={180} items={[{ label: 'Staff Identity number', value: maskNumber(data.ippisNumber) }]} />
          </>
        )}
        <Section
          title="Loan Information"
          step="loan"
          delay={240}
          items={[
            { label: 'How much do you need', value: formatNaira(data.amount) },
            { label: 'Purpose', value: data.purpose },
            { label: 'Loan Tenor', value: data.repaymentPeriod, fallback: 'To be confirmed in an approved offer' },
          ]}
        />
        {isPrivate && (
          <>
            <Section
              title="Work / Business"
              step="business"
              delay={270}
              items={
                isBusinessProduct(data.productCode)
                  ? [
                      { label: 'Repayment source', value: data.repaymentSource },
                      { label: 'Business name', value: data.businessName },
                      { label: 'Years in business', value: data.yearsOfExistence },
                      { label: 'RC / CAC number', value: data.rcNumber },
                      { label: 'Regulatory body', value: data.regulatoryBody },
                    ]
                  : [
                      { label: 'Repayment source', value: data.repaymentSource },
                      { label: 'Confirmed staff', value: data.confirmedStaff === 'yes' ? 'Yes' : data.confirmedStaff === 'no' ? 'No' : '' },
                      { label: 'Position', value: data.position, fallback: 'Not given' },
                    ]
              }
            />
            <Section
              title="Identity"
              step="identity"
              delay={290}
              items={[
                { label: 'BVN', value: maskNumber(data.bvn) },
                { label: 'NIN', value: maskNumber(data.nin) },
                { label: 'Verification', value: data.kyc?.verified ? 'Verified' : '' },
              ]}
            />
            <Section
              title="Bank Account"
              step="bank"
              delay={310}
              items={[
                { label: 'Bank', value: data.bank?.bankName ?? '' },
                { label: 'Account name', value: data.bank?.accountName ?? '' },
                { label: 'Account number', value: data.bank?.accountNumber ?? '' },
              ]}
            />
          </>
        )}
        <Section
          title="Uploaded Documents"
          step="documents"
          delay={330}
          items={[
            { label: 'Type of Valid ID', value: idTypeLabel(data.idType) },
            ...uploadSlotsFor(data.loanPackage, data.productCode).map(({ slot, label }) => ({
              label,
              value: data.uploads[slot]?.name ?? '',
            })),
          ]}
        />
        <Section
          title="Face Check"
          step="face"
          delay={350}
          items={[{ label: 'Face matched with your Valid ID', value: data.faceCheck.matched && data.uploads.face ? 'Completed' : '' }]}
        />
      </div>

      <section className="mt-6 flex flex-col gap-1 rounded-[14px] border border-app-line bg-white px-5 pt-[23px] pb-[27px] sm:px-[23px]">
        <h2 className="font-inter text-[21px] leading-[32.55px] font-bold tracking-[-0.4px] text-app-ink">
          Declaration and consent
        </h2>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(event) => update({ consent: event.target.checked })}
            className="peer sr-only"
          />
          <span
            className={cn(
              'mt-px flex size-5 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-lms-lilac',
              data.consent ? 'border-lms-purple bg-lms-purple' : 'border-[#bdb7c2] bg-white',
            )}
          >
            {data.consent && (
              <svg viewBox="0 0 14 14" className="anim-pop size-3.5" aria-hidden>
                <path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="font-inter text-[14px] leading-[21.7px] text-app-muted">
            I confirm that the information I have provided is accurate and I agree to the approved declarations and
            consent terms.
          </span>
        </label>
      </section>

      <InfoBox icon={iconWarning} iconWidth={18.1} tone="warning" className="mt-6">
        Submitting an application does not guarantee loan approval. Your information will be reviewed by the Dominion
        Merchant loan team.
      </InfoBox>

      {problem && (
        <div role="alert" className="anim-fade-in mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-[#fdecec] px-4 py-3 font-inter text-[14px] text-danger">
          <span>{problem.message}</span>
          {problem.step && problem.step !== 'review' && (
            <button type="button" onClick={() => navigate(`/apply/${problem.step}`)} className="font-bold underline underline-offset-2">
              Go to that step
            </button>
          )}
        </div>
      )}
    </StepPage>
  )
}
