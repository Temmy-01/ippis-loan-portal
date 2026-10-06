
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** @param {string} value */
export function isEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

/** @param {string} value */
export function isPhone(value) {
  return /^0\d{10}$/.test(value)
}

/** @param {string} value */
export function toPhoneDigits(value) {
  return value.replace(/\D/g, '').slice(0, 11)
}

/** @param {string} email */
export function maskEmail(email) {
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  return `${name[0]}••••@${domain}`
}
