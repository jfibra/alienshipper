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
          console.error(
            "LocationIQ API key missing. Make sure NEXT_PUBLIC_LOCATION_IQ_API_KEY is set in your environment variables.",
          )
          throw new Error("LocationIQ API key not configured. Please check your environment variables.")
        }

        console.log("Using API key:", apiKey.substring(0, 10) + "...")

        // Use the autocomplete endpoint which was working before
        const url = `https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(
          query,
        )}&format=json&limit=5&countrycodes=${country.toLowerCase()}&addressdetails=1`

        console.log("Request URL:", url.replace(apiKey, "***"))

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "AlienShipper/1.0",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`LocationIQ API Error ${response.status}:`, errorText)

          if (response.status === 401) {
            throw new Error("Invalid API key. Please check your NEXT_PUBLIC_LOCATION_IQ_API_KEY environment variable.")
          }

          throw new Error(`API request failed: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("API Response:", data)

        // Transform the response to match our expected format
        const transformedSuggestions = Array.isArray(data)
          ? data.map((item: any) => ({
              place_id: item.place_id,
              display_name: item.display_name,
              lat: item.lat,
              lon: item.lon,
              address: {
                house_number: item.address?.house_number || "",
                road: item.address?.road || "",
                city: item.address?.city || item.address?.town || item.address?.village || "",
                state: item.address?.state || "",
                postcode: item.address?.postcode || "",
                country: item.address?.country || "",
                country_code: item.address?.country_code?.toUpperCase() || country.toUpperCase(),
              },
            }))
          : []

        setSuggestions(transformedSuggestions)
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
