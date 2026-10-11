
export const GENDERS = ['Female', 'Male', 'Prefer not to say']

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const EMPLOYERS = [
  'Nigeria Immigration Service',
  'Nigeria Security and Civil Defence Corps',
  'Nigeria Customs Service',
  'Nigerian Correctional Service',
  'Nigeria Police Force',
  'Federal Road Safety Corps',
]

export const LOAN_PURPOSES = ['Personal expenses', 'Education', 'Medical', 'Home improvement', 'Business', 'Other']

export const REPAYMENT_PERIODS = ['3 months', '6 months', '9 months', '12 months', '18 months', '24 months']

export const UPLOAD_SLOTS = [
  { slot: 'workId', label: 'Work ID Card', required: true, accept: 'image/*,application/pdf', hint: 'Image or PDF' },
  { slot: 'passport', label: 'Passport Photograph', required: true, accept: 'image/*', hint: 'Image only' },
] as const

export const REQUIRED_UPLOADS = UPLOAD_SLOTS.filter((item) => item.required).map((item) => item.slot)

export const IPPIS_MAX_LENGTH = 9

export const EMPLOYER_IPPIS_PREFIX: Record<string, string> = {
  'Nigeria Police Force': 'PF',
}

export function ippisError(value: string, employer: string) {
  const number = value.trim().toUpperCase()
  if (number === '') return 'Enter your Staff Identity number'
  if (number.length > IPPIS_MAX_LENGTH) return `Your Staff Identity number must not be more than ${IPPIS_MAX_LENGTH} characters`
  if (!/^[A-Z0-9-]+$/.test(number)) return 'Use only letters and numbers'
  const prefix = EMPLOYER_IPPIS_PREFIX[employer]
  if (prefix && !number.startsWith(prefix)) return `${employer} Staff Identity numbers start with ${prefix}`
  return undefined
}

