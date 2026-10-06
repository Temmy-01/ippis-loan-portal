import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { ApplicationContext, EMPTY_APPLICATION, type ApplicationData, type SaveStatus } from './ApplicationContext'

const STORAGE_KEY = 'ippis-loan-application-draft'

function loadDraft(): ApplicationData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...EMPTY_APPLICATION, ...JSON.parse(saved) } : EMPTY_APPLICATION
  } catch {
    return EMPTY_APPLICATION
  }
}

// TODO: save the draft to the API instead.
export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ApplicationData>(loadDraft)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const firstRender = useRef(true)
  const latest = useRef(data)
  const pending = useRef(false)

  useEffect(() => {
    latest.current = data
  }, [data])

  useEffect(() => {
    const flush = () => {
      if (!pending.current) return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(latest.current))
      } catch {}
    }
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {}
      pending.current = false
      setSaveStatus('saved')
    }, 700)
    return () => clearTimeout(timer.current)
  }, [data])

  const update = useCallback((patch: Partial<ApplicationData>) => {
    pending.current = true
    setSaveStatus('saving')
    setData((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }))
  }, [])

  const reset = useCallback(() => {
    pending.current = false
    setData(EMPTY_APPLICATION)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const value = useMemo(() => ({ data, saveStatus, update, reset }), [data, saveStatus, update, reset])

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}
