
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** @param {string} value */
export function isEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

/** @param {string} value */
export function isPhone(value) {
  return /^0\d{10}$/.test(value)
}

/**
 * Email or Nigerian phone number (080..., +23480..., 23480...) in the format the server stores, or null.
 * @param {string} value
 */
export function toLogin(value) {
  const text = value.trim()
  if (text.includes('@')) return isEmail(text) ? text.toLowerCase() : null
  const digits = text.replace(/[\s-]/g, '')
  if (/^0\d{10}$/.test(digits)) return digits
  if (/^\+?234\d{10}$/.test(digits)) return `0${digits.slice(-10)}`
  return null
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
