import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

import type { ApplicationStatus, StatusSummary } from './status'

export type TimelineEntry = { title: string; description: string; at: string | null; done: boolean }

export type StageState = 'done' | 'current' | 'failed' | 'upcoming'

export type Timeline = {
  status: ApplicationStatus
  summary: StatusSummary | null
  stages: { name: string; state: StageState }[]
  lastUpdated: string
  history: TimelineEntry[]
}

export function useTimeline(applicationId: string | null) {
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!applicationId) return
    let cancelled = false
    api<Timeline>(`/portal/applications/${applicationId}/timeline`, { auth: true }).then((result) => {
      if (cancelled) return
      if (result.ok && result.payload) setTimeline(result.payload)
      else setError(result.message)
    })
    return () => {
      cancelled = true
    }
  }, [applicationId])

  return { timeline, error }
}
