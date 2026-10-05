
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** @param {string} value */
export function isEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

/** @param {string} value */
export function isPhone(value) {
  const digits = value.replace(/[\s-]/g, '')
  return /^(\+234|0)\d{10}$/.test(digits)
}

/** @param {string} email */
export function maskEmail(email) {
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  return `${name[0]}••••@${domain}`
}
