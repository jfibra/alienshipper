"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from "lucide-react"
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete"
import type { LocationIQSuggestion } from "@/lib/types/address"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect: (suggestion: LocationIQSuggestion) => void
  countryCode: string
  placeholder?: string
  className?: string
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  countryCode,
  placeholder = "Start typing your address...",
  className,
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { suggestions, isLoading, search, clearSuggestions } = useAddressAutocomplete(countryCode)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)

    if (newValue.length >= 3) {
      search(newValue)
      setIsOpen(true)
    } else {
      clearSuggestions()
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: LocationIQSuggestion) => {
    const addressText = suggestion.display_name.split(",")[0] // Get the first part (street address)
    setInputValue(addressText)
    onChange(addressText)
    onAddressSelect(suggestion)
    setIsOpen(false)
    clearSuggestions()
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-3">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Searching addresses...</span>
            </div>
          )}

          {!isLoading &&
            suggestions.map((suggestion) => (
              <Button
                key={suggestion.place_id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{suggestion.display_name}</div>
                </div>
              </Button>
            ))}

          {!isLoading && suggestions.length === 0 && inputValue.length >= 3 && (
            <div className="p-3 text-sm text-gray-500 text-center">No addresses found</div>
          )}
        </div>
      )}
    </div>
  )
}
