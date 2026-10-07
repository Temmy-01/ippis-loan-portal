import { useEffect, useSyncExternalStore } from 'react'

import { useSession } from '@/features/auth/session'
import { api } from '@/lib/api'

export type NotificationKind = 'verification' | 'application' | 'account'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  link: string
  readAt: string | null
  createdAt: string
}

const REFRESH_MS = 60_000

let notifications: AppNotification[] = []
const listeners = new Set<() => void>()

const set = (next: AppNotification[]) => {
  notifications = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const loadNotifications = async () => {
  const result = await api<AppNotification[]>('/portal/notifications', { auth: true })
  if (result.ok && result.payload) set(result.payload)
}

export const markRead = (id: string) => {
  const now = new Date().toISOString()
  set(notifications.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: now } : n)))
  api(`/portal/notifications/${id}/read`, { method: 'PATCH', auth: true })
}

export const markAllRead = () => {
  const now = new Date().toISOString()
  set(notifications.map((n) => (n.readAt ? n : { ...n, readAt: now })))
  api('/portal/notifications/read-all', { method: 'PATCH', auth: true })
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, () => notifications)
}

export function useNotificationSync() {
  const owner = useSession()?.customer.id

  useEffect(() => {
    set([])
    if (!owner) return
    loadNotifications()
    const timer = setInterval(loadNotifications, REFRESH_MS)
    window.addEventListener('focus', loadNotifications)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', loadNotifications)
    }
  }, [owner])
}
