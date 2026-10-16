
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
  'Staff Officers',
]

export const LOAN_PURPOSES = ['Personal expenses', 'Education', 'Medical', 'Home improvement', 'Business', 'Other']

export const REPAYMENT_PERIODS = ['3 months', '6 months', '9 months', '12 months', '18 months', '24 months']

export type DocumentSlot = 'workId' | 'passport' | 'meansOfId' | 'cac'

export type SlotConfig = { slot: DocumentSlot; label: string; accept: string; hint: string }

const SLOT_CONFIGS: Record<DocumentSlot, SlotConfig> = {
  workId: { slot: 'workId', label: 'Work ID Card', accept: 'image/*,application/pdf', hint: 'Image or PDF' },
  meansOfId: { slot: 'meansOfId', label: "Valid ID (NIN, driver's licence, voter's card or passport)", accept: 'image/*', hint: 'Clear photo of the ID, showing all four edges' },
  passport: { slot: 'passport', label: 'Passport Photograph', accept: 'image/*', hint: 'Image only' },
  cac: { slot: 'cac', label: 'CAC Certificate', accept: 'image/*,application/pdf', hint: 'Image or PDF' },
}

export const PRIVATE_PRODUCTS = [
  { code: '302', name: 'SME Loans', description: 'Working capital and growth funding for your business.', kind: 'business' },
  { code: '303', name: 'Auto Loans', description: 'Finance a vehicle for personal or business use.', kind: 'business' },
  { code: '305', name: 'DMB LEE (Employee Loans)', description: 'Loans for employees, repaid from salary.', kind: 'employee' },
] as const

export const isBusinessProduct = (code: string) => PRIVATE_PRODUCTS.some((product) => product.code === code && product.kind === 'business')

export const productName = (code: string) => PRIVATE_PRODUCTS.find((product) => product.code === code)?.name ?? ''

export const REPAYMENT_SOURCES = ['Salary', 'Business income', 'Other income']

export const REGULATORY_BODIES = ['CAC', 'SCUML', 'CBN', 'NAFDAC', 'SON', 'Other']

// The Valid ID is matched with the customer's face by Prembly, so it must be a photo.
export const ID_TYPES = [
  { value: 'nin', label: 'NIN slip / National ID card' },
  { value: 'driversLicence', label: "Driver's licence" },
  { value: 'votersCard', label: "Voter's card" },
  { value: 'passport', label: 'International passport' },
] as const

export const idTypeLabel = (value: string) => ID_TYPES.find((type) => type.value === value)?.label ?? ''

export const uploadSlotsFor = (loanPackage: string | null, productCode: string): SlotConfig[] => {
  if (loanPackage !== 'private') return [SLOT_CONFIGS.workId, SLOT_CONFIGS.meansOfId]
  const slots = [SLOT_CONFIGS.meansOfId]
  if (isBusinessProduct(productCode)) slots.push(SLOT_CONFIGS.cac)
  return slots
}

export const IPPIS_MAX_LENGTH = 9

export const EMPLOYER_IPPIS_PREFIX: Record<string, string> = {
  'Nigeria Police Force': 'PF',
  'Staff Officers': 'DM',
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

