"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import {
  recipientAddressSchema,
  shippingAddressSchema,
  type RecipientAddressFormData,
  type ShippingAddressFormData,
} from "@/lib/validations/address"
import type { Country, RecipientAddress, ShippingAddress, UserProfile, LocationIQSuggestion } from "@/lib/types/address"

interface AddressFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RecipientAddressFormData | ShippingAddressFormData) => Promise<void>
  type: "recipient" | "shipping"
  editingAddress?: RecipientAddress | ShippingAddress | null
  countries: Country[]
  userProfile?: UserProfile
}

export function AddressForm({
  isOpen,
  onClose,
  onSubmit,
  type,
  editingAddress,
  countries,
  userProfile,
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = type === "recipient" ? recipientAddressSchema : shippingAddressSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<RecipientAddressFormData | ShippingAddressFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company: "",
      street_address: "",
      street_address_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "United States",
      country_code: "US",
      address_type: "residential",
      is_default: false,
      ...(type === "shipping" && { usage_type: "shipping" }),
    },
  })

  const selectedCountry = watch("country")
  const selectedCountryCode = watch("country_code")
  const selectedAddressType = watch("address_type")
  const selectedUsageType =
    type === "shipping" ? watch("usage_type" as keyof (RecipientAddressFormData | ShippingAddressFormData)) : undefined
  const streetAddress = watch("street_address")
  const isDefault = watch("is_default")

  // Auto-fill user data for shipping addresses
  useEffect(() => {
    if (isOpen && !editingAddress && type === "shipping" && userProfile) {
      setValue("full_name", userProfile.full_name || "")
      setValue("email", userProfile.email || "")
      setValue("phone", userProfile.phone || "")
      setValue("company", userProfile.company || "")
    }
  }, [isOpen, editingAddress, type, userProfile, setValue])

  useEffect(() => {
    if (editingAddress) {
      // Map database fields to form fields
      const mappedAddress = {
        full_name: editingAddress.full_name,
        email: editingAddress.email,
        phone: type === "recipient" ? (editingAddress as RecipientAddress).phone_number : editingAddress.phone,
        company: editingAddress.company,
        street_address:
          type === "recipient"
            ? (editingAddress as RecipientAddress).street1
            : (editingAddress as ShippingAddress).address_line1,
        street_address_2:
          type === "recipient"
            ? (editingAddress as RecipientAddress).street2
            : (editingAddress as ShippingAddress).address_line2,
        city: editingAddress.city,
        state: editingAddress.state,
        postal_code: editingAddress.postal_code,
        country: editingAddress.country,
        country_code: editingAddress.country_code,
        address_type: editingAddress.address_type,
        is_default: editingAddress.is_default,
        ...(type === "shipping" && { usage_type: (editingAddress as ShippingAddress).usage_type }),
      }

      Object.entries(mappedAddress).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof (RecipientAddressFormData | ShippingAddressFormData), value)
        }
      })
    } else {
      const defaultValues = {
        full_name: type === "shipping" && userProfile ? userProfile.full_name || "" : "",
        email: type === "shipping" && userProfile ? userProfile.email || "" : "",
        phone: type === "shipping" && userProfile ? userProfile.phone || "" : "",
        company: type === "shipping" && userProfile ? userProfile.company || "" : "",
        street_address: "",
        street_address_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "United States",
        country_code: "US",
        address_type: "residential",
        is_default: false,
        ...(type === "shipping" && { usage_type: "shipping" }),
      }
      reset(defaultValues)
    }
  }, [editingAddress, reset, setValue, type, userProfile])

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country) {
      setValue("country_code", countryCode)
      setValue("country", country.name)
    }
  }

  const handleAddressSelect = (suggestion: LocationIQSuggestion) => {
    const address = suggestion.address

    if (address.city) setValue("city", address.city)
    if (address.state) setValue("state", address.state)
    if (address.postcode) setValue("postal_code", address.postcode)
    if (address.country_code) {
      const country = countries.find((c) => c.code.toLowerCase() === address.country_code?.toLowerCase())
      if (country) {
        setValue("country_code", country.code)
        setValue("country", country.name)
      }
    }
  }

  const handleFormSubmit = async (data: RecipientAddressFormData | ShippingAddressFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      onClose()
      reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? "Edit" : "Add"} {type === "recipient" ? "Recipient" : "Shipping"} Address
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" {...register("full_name")} placeholder="John Doe" />
              {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} placeholder="+1 (555) 123-4567" />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register("company")} placeholder="Acme Corp" />
              {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street_address">Street Address *</Label>
            <AddressAutocomplete
              value={streetAddress}
              onChange={(value) => setValue("street_address", value)}
              onAddressSelect={handleAddressSelect}
              countryCode={selectedCountryCode}
              placeholder="Start typing your address..."
            />
            {errors.street_address && <p className="text-sm text-red-600">{errors.street_address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="street_address_2">Street Address 2</Label>
            <Input id="street_address_2" {...register("street_address_2")} placeholder="Apt 4B, Suite 100, etc." />
            {errors.street_address_2 && <p className="text-sm text-red-600">{errors.street_address_2.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} placeholder="New York" />
              {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input id="state" {...register("state")} placeholder="NY" />
              {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input id="postal_code" {...register("postal_code")} placeholder="10001" />
              {errors.postal_code && <p className="text-sm text-red-600">{errors.postal_code.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country *</Label>
              <Select value={selectedCountryCode} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-600">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Address Type *</Label>
              <Select value={selectedAddressType} onValueChange={(value) => setValue("address_type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="pickup_point">Pickup Point</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.address_type && <p className="text-sm text-red-600">{errors.address_type.message}</p>}
            </div>
          </div>

          {type === "shipping" && (
            <div className="space-y-2">
              <Label>Usage Type *</Label>
              <Select
                value={selectedUsageType as string}
                onValueChange={(value) =>
                  setValue("usage_type" as keyof (RecipientAddressFormData | ShippingAddressFormData), value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select usage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping Only</SelectItem>
                  <SelectItem value="return">Return Only</SelectItem>
                  <SelectItem value="both">Both Shipping & Return</SelectItem>
                </SelectContent>
              </Select>
              {errors.usage_type && <p className="text-sm text-red-600">{(errors as any).usage_type.message}</p>}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={isDefault}
              onCheckedChange={(checked) => setValue("is_default", checked as boolean)}
            />
            <Label
              htmlFor="is_default"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default address
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
