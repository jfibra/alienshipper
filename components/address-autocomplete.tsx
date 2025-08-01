"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
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
  placeholder = "Enter street address",
  className,
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { suggestions, isLoading, searchAddresses, clearSuggestions } = useAddressAutocomplete()

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
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
      searchAddresses(newValue, countryCode)
      setIsOpen(true)
    } else {
      clearSuggestions()
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: LocationIQSuggestion) => {
    const address = suggestion.address
    const streetAddress = [address.house_number, address.road].filter(Boolean).join(" ")

    setInputValue(streetAddress || suggestion.display_name.split(",")[0])
    onChange(streetAddress || suggestion.display_name.split(",")[0])
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
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={className}
        />
        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
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
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {[suggestion.address.house_number, suggestion.address.road].filter(Boolean).join(" ") ||
                        suggestion.display_name.split(",")[0]}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{suggestion.display_name}</div>
                  </div>
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
