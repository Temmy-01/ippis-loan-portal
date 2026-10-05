export const APPLICATION_STEPS = [
  {
    slug: 'personal',
    label: 'Personal Information',
    title: 'Tell us about yourself',
    description: 'Please provide your personal details as they appear on your official documents.',
  },
  {
    slug: 'employment',
    label: 'Employment Information',
    title: 'Your employment details',
    description: 'Tell us about your current employment so we can assess your application.',
  },
  {
    slug: 'ippis',
    label: 'IPPIS Information',
    title: 'Your IPPIS details',
    description: 'Enter your IPPIS information carefully to help us process your application.',
  },
  {
    slug: 'loan',
    label: 'Loan Information',
    title: 'Tell us about the loan you need',
    description: 'Share the amount you would like to apply for and the information needed to assess your request.',
  },
  {
    slug: 'documents',
    label: 'Documents',
    title: 'Upload your supporting documents',
    description:
      'Please upload the documents requested for your application. Make sure each file is clear and readable.',
  },
  {
    slug: 'review',
    label: 'Review & Submit',
    title: 'Review your information',
    description: 'Please check your details carefully before submitting your application.',
  },
] as const

export type StepSlug = (typeof APPLICATION_STEPS)[number]['slug']

export const stepIndex = (slug: string) => APPLICATION_STEPS.findIndex((step) => step.slug === slug)
