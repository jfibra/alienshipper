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
        const apiKey = process.env.NEXT_PUBLIC_LOCATION_IQ_API_KEY
        if (!apiKey) {
          throw new Error("LocationIQ API key not configured")
        }

        const response = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
            query,
          )}&format=json&addressdetails=1&limit=5&countrycodes=${country.toLowerCase()}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(Array.isArray(data) ? data : [])
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
