"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error saving to localStorage key "${key}":`, error)
    }
  }

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoading(false)
    }
  }, [key])

  return [storedValue, setValue, isLoading] as const
}
