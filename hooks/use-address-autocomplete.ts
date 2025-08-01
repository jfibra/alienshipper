"use client"

import { useState, useCallback } from "react"
import { debounce } from "lodash"
import type { LocationIQSuggestion } from "@/lib/types/address"

export function useAddressAutocomplete(countryCode = "US") {
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAddresses = useCallback(
    debounce(async (query: string, country: string) => {
      if (!query || query.length < 3) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Use our server-side API route instead of calling LocationIQ directly
        const url = `/api/address-autocomplete?q=${encodeURIComponent(query)}&countrycodes=${country}`

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API request failed: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(data)
      } catch (err) {
        console.error("Address search error:", err)
        setError(err instanceof Error ? err.message : "Failed to search addresses")
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [],
  )

  const search = useCallback(
    (query: string) => {
      searchAddresses(query, countryCode)
    },
    [searchAddresses, countryCode],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    search,
    clearSuggestions,
  }
}
