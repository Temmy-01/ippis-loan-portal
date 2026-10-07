import { clearSession, getSession } from '@/features/auth/session'

export const API_BASE_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:8522/dominion/api/v2').replace(/\/+$/, '')

export type ApiResult<T> = {
  ok: boolean
  status: number
  message: string
  payload: T | null
}

type Options = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export async function api<T = unknown>(path: string, { method, body, auth = false }: Options = {}): Promise<ApiResult<T>> {
  const token = auth ? getSession()?.token : undefined

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: method ?? (body ? 'POST' : 'GET'),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await response.json().catch(() => null)

    if (response.status === 401 && token) clearSession()

    return {
      ok: response.ok && json?.status === true,
      status: response.status,
      message: json?.message ?? 'Something went wrong. Please try again.',
      payload: (json?.payload ?? null) as T | null,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "We couldn't reach the server. Check your connection and try again.",
      payload: null,
    }
  }
}
