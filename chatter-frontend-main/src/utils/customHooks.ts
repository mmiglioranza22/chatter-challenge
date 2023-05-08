import { useEffect, useState } from 'react'

export const useSessionStorage = (key: string, initialState: string) => {
let firstValue:any = ''
  if (typeof window !== "undefined") {
    firstValue = window.sessionStorage.getItem(key)
  }
  const [value, setValue] = useState(firstValue || initialState)

  useEffect(() => {
    sessionStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue] as const
}