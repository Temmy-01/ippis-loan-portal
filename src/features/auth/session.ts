import { useSyncExternalStore } from 'react'

export type Customer = {
  id: string
  fullName: string
  email: string
  phone: string
  customerSince: string
}

export type Session = { token: string; customer: Customer }

const STORAGE_KEY = 'portal-session'

const read = (): Session | null => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Session) : null
  } catch {
    return null
  }
}

let session = read()
const listeners = new Set<() => void>()

const save = (next: Session | null) => {
  session = next
  try {
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {}
  listeners.forEach((listener) => listener())
}

export const getSession = () => session
export const setSession = (next: Session) => save(next)
export const clearSession = () => save(null)
export const updateCustomer = (customer: Customer) => session && save({ ...session, customer })

export const useSession = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => session,
  )

export const firstNameOf = (customer: Customer) => customer.fullName.trim().split(/\s+/)[0]

export const initialsOf = (customer: Customer) =>
  customer.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
