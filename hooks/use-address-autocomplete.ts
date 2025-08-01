"use client"

import { useState, useCallback } from "react"

interface AddressSuggestion {
  place_id: string
  display_name: string
  lat: string
  lon: string
  address?: {
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAddresses = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch address suggestions")
      }

      const data = await response.json()
      setSuggestions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  return {
    suggestions,
    loading,
    error,
    searchAddresses,
    clearSuggestions,
  }
}
