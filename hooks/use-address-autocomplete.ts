"use client"

import { useState, useCallback, useRef } from "react"
import type { LocationIQSuggestion } from "@/lib/types/address"

export function useAddressAutocomplete(countryCode = "US") {
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()
  const lastQueryRef = useRef<string>("")

  const search = useCallback(
    async (query: string) => {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Don't search if query is the same as last query
      if (query.trim() === lastQueryRef.current) {
        return
      }

      debounceRef.current = setTimeout(async () => {
        if (query.trim().length < 3) {
          setSuggestions([])
          setError(null)
          return
        }

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController()
        lastQueryRef.current = query.trim()

        setIsLoading(true)
        setError(null)

        try {
          const response = await fetch(
            `/api/address-autocomplete?q=${encodeURIComponent(query.trim())}&countrycode=${countryCode}`,
            {
              signal: abortControllerRef.current.signal,
            },
          )

          if (!response.ok) {
            if (response.status === 429) {
              throw new Error("Too many requests. Please wait a moment.")
            }
            throw new Error(`HTTP ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          setSuggestions(data.suggestions || [])
        } catch (err: any) {
          if (err.name === "AbortError") {
            // Request was cancelled, ignore
            return
          }
          console.error("Address autocomplete error:", err)
          setError(err.message || "Failed to fetch suggestions")
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      }, 300) // Reduced debounce time for better UX
    },
    [countryCode],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    lastQueryRef.current = ""
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    search,
    clearSuggestions,
  }
}
