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
        const apiKey = process.env.NEXT_PUBLIC_LOCATION_IQ_API_KEY || "pk.fd453d1d34b1ce7133796b811cbd3ee1"
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(
            query,
          )}&countrycodes=${country}&limit=5&format=json`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(data || [])
      } catch (err) {
        console.error("Address autocomplete error:", err)
        setError("Failed to fetch address suggestions")
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
