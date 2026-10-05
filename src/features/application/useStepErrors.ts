import { useState } from 'react'

import { useApplication, type ApplicationData } from './ApplicationContext'

type Rules<K extends keyof ApplicationData> = Partial<Record<K, (value: ApplicationData[K], data: ApplicationData) => string | undefined>>

export function useStepErrors<K extends keyof ApplicationData>(rules: Rules<K>) {
  const { data, update } = useApplication()
  const [errors, setErrors] = useState<Partial<Record<K, string>>>({})

  const validate = () => {
    const next: Partial<Record<K, string>> = {}
    for (const key of Object.keys(rules) as K[]) {
      const message = rules[key]?.(data[key], data)
      if (message) next[key] = message
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const field = (name: keyof ApplicationData) => {
    const error = (errors as Partial<Record<keyof ApplicationData, string>>)[name]
    return {
      value: data[name] as string,
      error,
      onValueChange: (value: string) => {
        update({ [name]: value } as Partial<ApplicationData>)
        if (error) setErrors((prev) => ({ ...prev, [name]: undefined }))
      },
    }
  }

  return { data, update, errors, setErrors, validate, field }
}

export const required = (message: string) => (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? message : undefined
