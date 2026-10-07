export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'final_review'
  | 'approved'
  | 'declined'
  | 'closed'
  | 'disbursed'
  | 'disbursement_delayed'

export type StatusTone = 'progress' | 'success' | 'negative' | 'warning'

export type StatusSummary = { label: string; tone: StatusTone; step: number; action?: 'verify_identity' | null }

export const TONE_STYLES: Record<StatusTone, { pill: string; dot: string }> = {
  progress: { pill: 'bg-sky-soft text-sky-ink', dot: 'bg-sky-ink' },
  success: { pill: 'bg-[#e8f8f0] text-[#17724d]', dot: 'bg-[#17724d]' },
  negative: { pill: 'bg-[#fdeced] text-[#b4282d]', dot: 'bg-[#b4282d]' },
  warning: { pill: 'bg-amber-soft text-amber', dot: 'bg-amber' },
}

export const STATUS_MESSAGES: Record<Exclude<ApplicationStatus, 'draft'>, string> = {
  submitted: "Your application has been submitted successfully. We'll let you know as soon as our loan team starts reviewing it.",
  in_review: "Your application is currently being reviewed by our loan team. We'll notify you when there is an update or when an action is required from you.",
  final_review: "Your application passed review and is now awaiting final approval. We'll notify you once a decision is made.",
  approved: "Good news! Your loan has been approved and we're now disbursing it. We'll let you know once it's paid.",
  declined: 'Your application was not approved at this time. Your relationship manager may contact you about next steps.',
  closed: 'This application has been closed and can no longer continue. You can start a new application at any time.',
  disbursed: 'Your loan has been paid into your account.',
  disbursement_delayed: "We hit a delay while paying your loan. Our team is retrying and will keep you updated.",
}

export const STATUS_TITLES: Record<Exclude<ApplicationStatus, 'draft'>, string> = {
  submitted: 'Your application has been submitted',
  in_review: 'Your application is under review',
  final_review: 'Your application is awaiting final approval',
  approved: 'Your loan has been approved',
  declined: 'Your application was not approved',
  closed: 'Your application has been closed',
  disbursed: 'Your loan has been disbursed',
  disbursement_delayed: 'Your disbursement is delayed',
}

export const VERIFY_TITLE = 'Verify your identity'

export const VERIFY_MESSAGE =
  'Our loan team has started on your application. Complete a quick face check so we can continue.'

export const TRACK_STAGE_COUNT = 8

export const isSubmitted = (status: ApplicationStatus | null) => Boolean(status && status !== 'draft')
