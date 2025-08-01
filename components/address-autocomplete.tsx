"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete"
import { cn } from "@/lib/utils"

interface AddressAutocompleteProps {
  value?: string
  onChange?: (value: string) => void
  onSelect?: (address: any) => void
  placeholder?: string
  className?: string
}

export function AddressAutocomplete({
  value = "",
  onChange,
  onSelect,
  placeholder = "Start typing an address...",
  className,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { suggestions, isLoading, error, search, clearSuggestions } = useAddressAutocomplete()

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)

    if (newValue.length >= 3) {
      search(newValue)
      setShowSuggestions(true)
    } else {
      clearSuggestions()
      setShowSuggestions(false)
    }
    setSelectedIndex(-1)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(suggestion.display_name)
    onChange?.(suggestion.display_name)
    onSelect?.(suggestion)
    setShowSuggestions(false)
    clearSuggestions()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading && <div className="px-3 py-2 text-sm text-gray-500">Searching addresses...</div>}

          {error && <div className="px-3 py-2 text-sm text-red-500">{error}</div>}

          {!isLoading && !error && suggestions.length === 0 && inputValue.length >= 3 && (
            <div className="px-3 py-2 text-sm text-gray-500">No addresses found</div>
          )}

          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              className={cn(
                "px-3 py-2 cursor-pointer text-sm hover:bg-gray-100",
                selectedIndex === index && "bg-gray-100",
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.display_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
