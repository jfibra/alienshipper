"use client"

import { useState, useCallback, useRef } from "react"
import { debounce } from "lodash"

interface AddressSuggestion {
  place_id: string
  display_name: string
  address: {
    house_number: string
    road: string
    city: string
    state: string
    postcode: string
    country: string
  }
}

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastQueryRef = useRef<string>("")

  const searchAddresses = useCallback(
    debounce(async (query: string) => {
      // Don't search if query is the same as last query
      if (query === lastQueryRef.current) {
        return
      }

      lastQueryRef.current = query

      if (!query || query.length < 3) {
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

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(query)}`, {
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error: any) {
        if (error.name === "AbortError") {
          // Request was cancelled, ignore
          return
        }
        console.error("Address autocomplete error:", error)
        setError(error.message)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    lastQueryRef.current = ""
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    search: searchAddresses,
    clearSuggestions,
  }
}
