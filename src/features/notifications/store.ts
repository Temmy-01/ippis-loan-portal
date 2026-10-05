import { useSyncExternalStore } from 'react'

export type NotificationKind = 'verification' | 'application' | 'account'

export type AppNotification = {
  id: string
  kind: NotificationKind
  category: string
  title: string
  body: string
  date: string
  to: string
  read: boolean
}

let notifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'verification',
    category: 'Verification',
    title: 'Identity verification is required',
    body: 'Complete verification to help us continue your application.',
    date: '20 June 2025',
    to: '/verify-identity',
    read: false,
  },
  {
    id: 'n2',
    kind: 'application',
    category: 'Application',
    title: 'Your application is under review',
    body: "We'll notify you if any action is required.",
    date: '20 June 2025',
    to: '/track',
    read: false,
  },
  {
    id: 'n3',
    kind: 'account',
    category: 'Account',
    title: 'Your account has been created',
    body: 'Welcome to the Dominion Merchant IPPIS Loan Portal.',
    date: '20 June 2025',
    to: '/profile',
    read: false,
  },
]

const listeners = new Set<() => void>()

const set = (next: AppNotification[]) => {
  notifications = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const markRead = (id: string) => set(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
export const markAllRead = () => set(notifications.map((n) => ({ ...n, read: true })))

export function useNotifications() {
  return useSyncExternalStore(subscribe, () => notifications)
}
