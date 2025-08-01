"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, MapPin, Mail, Phone, Building } from "lucide-react"
import type { Country, RecipientAddress, ShippingAddress } from "@/lib/types/address"

interface AddressListProps {
  addresses: (RecipientAddress | ShippingAddress)[]
  countries: Country[]
  type: "recipient" | "shipping"
  onEdit: (address: RecipientAddress | ShippingAddress) => void
  onDelete: (id: string) => Promise<void>
  isLoading: boolean
}

export function AddressList({ addresses, countries, type, onEdit, onDelete, isLoading }: AddressListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getCountryName = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    return country?.name || countryCode
  }

  const getAddressTypeColor = (addressType: string) => {
    const colors = {
      residential: "bg-blue-100 text-blue-800",
      warehouse: "bg-purple-100 text-purple-800",
      office: "bg-green-100 text-green-800",
      business: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[addressType as keyof typeof colors] || colors.other
  }

  const getUsageTypeColor = (usageType: string) => {
    const colors = {
      shipping: "bg-emerald-100 text-emerald-800",
      return: "bg-amber-100 text-amber-800",
      both: "bg-indigo-100 text-indigo-800",
    }
    return colors[usageType as keyof typeof colors] || colors.shipping
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } catch (error) {
      console.error("Error deleting address:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first {type === "recipient" ? "recipient" : "shipping"} address.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <Card key={address.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">{address.full_name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getAddressTypeColor(address.address_type)}>{address.address_type}</Badge>
                  {type === "shipping" && "usage_type" in address && (
                    <Badge className={getUsageTypeColor(address.usage_type)}>{address.usage_type}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div>{address.street_address}</div>
                  {address.street_address_2 && <div>{address.street_address_2}</div>}
                  <div>
                    {address.city}, {address.state} {address.postal_code}
                  </div>
                  <div>{getCountryName(address.country)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{address.email}</span>
              </div>

              {address.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{address.phone}</span>
                </div>
              )}

              {address.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{address.company}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(address)} className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Address</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this address? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => address.id && handleDelete(address.id)}
                      disabled={deletingId === address.id}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deletingId === address.id ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
