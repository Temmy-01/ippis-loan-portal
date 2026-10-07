import { useEffect, useState } from 'react'

export const CODE_VALID_SECONDS = 10 * 60
export const RESEND_WAIT_SECONDS = 60

export const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export function useCodeTimer() {
  const [secondsLeft, setSecondsLeft] = useState(CODE_VALID_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  return {
    secondsLeft,
    expired: secondsLeft <= 0,
    canResend: CODE_VALID_SECONDS - secondsLeft >= RESEND_WAIT_SECONDS,
    restart: () => setSecondsLeft(CODE_VALID_SECONDS),
  }
}
