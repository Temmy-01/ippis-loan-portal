
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
  { slot: 'signature', label: 'Signature', required: true, accept: 'image/*', hint: 'Image only' },
  { slot: 'other', label: 'Other Documents', required: false, accept: 'image/*,application/pdf', hint: 'Image or PDF' },
] as const

export const REQUIRED_UPLOADS = UPLOAD_SLOTS.filter((item) => item.required).map((item) => item.slot)
