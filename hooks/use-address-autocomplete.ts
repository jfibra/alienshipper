"use client"

import { useState, useCallback } from "react"
import { debounce } from "lodash"
import type { LocationIQSuggestion } from "@/lib/types/address"

const LOCATION_IQ_API_KEY = "pk.fd453d1d34b1ce7133796b811cbd3ee1"

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchAddresses = useCallback(
    debounce(async (query: string, countryCode = "US") => {
      if (!query || query.length < 3) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${LOCATION_IQ_API_KEY}&q=${encodeURIComponent(
            query,
          )}&countrycodes=${countryCode}&limit=5&format=json&addressdetails=1`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions")
        }

        const data = await response.json()
        setSuggestions(data || [])
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  return {
    suggestions,
    isLoading,
    searchAddresses,
    clearSuggestions,
  }
}
