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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      try {
        await onDelete(deletingId)
        setShowDeleteDialog(false)
        setDeletingId(null)
      } catch (error) {
        console.error("Error deleting address:", error)
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
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
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No addresses</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first {type === "recipient" ? "recipient" : "shipping"} address.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <Card key={address.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{address.full_name}</CardTitle>
                  {address.company && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {address.company}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(address)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(address.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span>{address.street_address}</span>
                </div>
                {address.street_address_2 && (
                  <div className="text-sm text-gray-600 ml-5">{address.street_address_2}</div>
                )}
                <div className="text-sm text-gray-600 ml-5">
                  {address.city}, {address.state} {address.postal_code}
                </div>
                <div className="text-sm text-gray-600 ml-5">{getCountryName(address.country)}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span>{address.email}</span>
                </div>
                {address.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{address.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className={getAddressTypeColor(address.address_type)}>
                  {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                </Badge>
                {type === "shipping" && "usage_type" in address && (
                  <Badge className={getUsageTypeColor(address.usage_type)}>
                    {address.usage_type === "both"
                      ? "Shipping & Return"
                      : address.usage_type.charAt(0).toUpperCase() + address.usage_type.slice(1)}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the address from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
