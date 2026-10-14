import type { LoanPackageId } from '@/data/loanPackages'

const STEP_DEFS = {
  personal: {
    label: 'Personal Information',
    title: 'Tell us about yourself',
    description: 'Please provide your personal details as they appear on your official documents.',
  },
  employment: {
    label: 'Employment Information',
    title: 'Your employment details',
    description: 'Tell us about your current employment so we can assess your application.',
  },
  'staff-id': {
    label: 'Staff Identity Information',
    title: 'Your details',
    description: 'Enter your information carefully to help us process your application.',
  },
  loantype: {
    label: 'Loan Type',
    title: 'Choose your loan type',
    description: 'Pick the loan that fits what you need. You can change it before you submit.',
  },
  loan: {
    label: 'Loan Information',
    title: 'Tell us about the loan you need',
    description: 'Share the amount you would like to apply for and the information needed to assess your request.',
  },
  business: {
    label: 'Work / Business',
    title: 'About your work or business',
    description: 'A few details our loan team needs for the loan type you chose.',
  },
  identity: {
    label: 'Identity',
    title: 'Confirm your identity',
    description: 'Enter your BVN and NIN. We check them against official records to protect you.',
  },
  documents: {
    label: 'Documents',
    title: 'Upload your supporting documents',
    description: 'Please upload the documents requested for your application. Make sure each file is clear and readable.',
  },
  bank: {
    label: 'Bank Account',
    title: 'Link your bank account',
    description: 'Securely link the account your salary or business income is paid into. It must be in your name.',
  },
  face: {
    label: 'Face Check',
    title: "Let's confirm it's really you",
    description: 'A quick live face check with your camera. Your photo is saved with your application for our loan team.',
  },
  review: {
    label: 'Review & Submit',
    title: 'Review your information',
    description: 'Please check your details carefully before submitting your application.',
  },
} as const

export type StepSlug = keyof typeof STEP_DEFS

export type ApplicationStep = { slug: StepSlug; label: string; title: string; description: string }

const PACKAGE_STEPS: Record<LoanPackageId, StepSlug[]> = {
  ippis: ['personal', 'employment', 'staff-id', 'loan', 'documents', 'face', 'review'],
  private: ['personal', 'loantype', 'loan', 'business', 'identity', 'documents', 'bank', 'face', 'review'],
}

export const stepsFor = (loanPackage: LoanPackageId | null): ApplicationStep[] =>
  PACKAGE_STEPS[loanPackage ?? 'ippis'].map((slug) => ({ slug, ...STEP_DEFS[slug] }))

export const isStepSlug = (value: string): value is StepSlug => value in STEP_DEFS
