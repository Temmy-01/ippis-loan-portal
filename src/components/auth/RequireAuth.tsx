import { useEffect, useRef } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { type Customer, updateCustomer, useSession } from '@/features/auth/session'
import { api } from '@/lib/api'

export function RequireAuth() {
  const session = useSession()
  const location = useLocation()
  const refreshed = useRef(false)

  useEffect(() => {
    if (!session || refreshed.current) return
    refreshed.current = true
    api<Customer>('/portal/auth/me', { auth: true }).then((result) => {
      if (result.ok && result.payload) updateCustomer(result.payload)
    })
  }, [session])

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}
