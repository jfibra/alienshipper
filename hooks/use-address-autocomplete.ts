"use client"

import { useState, useCallback, useRef } from "react"

interface AddressSuggestion {
  place_id: string
  display_name: string
  address: {
    house_number?: string
    road?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastQueryRef = useRef<string>("")

  const search = useCallback(async (query: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Don't search if query is too short or same as last query
    if (!query || query.length < 3 || query === lastQueryRef.current) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    lastQueryRef.current = query

    // Debounce the search
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(query)}`, {
          signal: abortControllerRef.current?.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Address search error:", err)
          setError("Failed to search addresses")
          setSuggestions([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    lastQueryRef.current = ""
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    search,
    clearSuggestions,
  }
}
