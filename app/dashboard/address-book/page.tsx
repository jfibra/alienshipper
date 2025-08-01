"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { AddressForm } from "@/components/address-form"
import { AddressList } from "@/components/address-list"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { Country, RecipientAddress, ShippingAddress, UserProfile } from "@/lib/types/address"
import type { RecipientAddressFormData, ShippingAddressFormData } from "@/lib/validations/address"

export default function AddressBook() {
  const [activeTab, setActiveTab] = useState("recipient")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<RecipientAddress | ShippingAddress | null>(null)
  const [recipientAddresses, setRecipientAddresses] = useState<RecipientAddress[]>([])
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined)

  // Load countries data
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch("/countries.json")
        const countriesData = await response.json()
        setCountries(countriesData)
      } catch (error) {
        console.error("Error loading countries:", error)
        toast.error("Failed to load countries data")
      }
    }
    loadCountries()
  }, [])

  // Get current user and profile
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Create user profile from auth data
        setUserProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          company: user.user_metadata?.company || "",
        })
      }
    }
    getUser()
  }, [])

  // Load addresses
  useEffect(() => {
    if (user) {
      loadAddresses()
    }
  }, [user])

  const loadAddresses = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Load recipient addresses
      const { data: recipientData, error: recipientError } = await supabase
        .from("recipient_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (recipientError) throw recipientError

      // Load shipping addresses
      const { data: shippingData, error: shippingError } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (shippingError) throw shippingError

      setRecipientAddresses(recipientData || [])
      setShippingAddresses(shippingData || [])
    } catch (error) {
      console.error("Error loading addresses:", error)
      toast.error("Failed to load addresses")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setIsFormOpen(true)
  }

  const handleEditAddress = (address: RecipientAddress | ShippingAddress) => {
    setEditingAddress(address)
    setIsFormOpen(true)
  }

  const handleSubmitAddress = async (data: RecipientAddressFormData | ShippingAddressFormData) => {
    if (!user) return

    try {
      if (activeTab === "recipient") {
        // Map form data to database schema for recipient addresses
        const recipientData = {
          user_id: user.id,
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone || null,
          company: data.company || null,
          street1: data.street_address,
          street2: data.street_address_2 || null,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          country_code: data.country_code,
          address_type: data.address_type,
          is_default: data.is_default || false,
          updated_at: new Date().toISOString(),
        }

        if (editingAddress) {
          // Update existing recipient address
          const { error } = await supabase.from("recipient_addresses").update(recipientData).eq("id", editingAddress.id)

          if (error) throw error
          toast.success("Recipient address updated successfully")
        } else {
          // Create new recipient address
          const { error } = await supabase.from("recipient_addresses").insert({
            ...recipientData,
            created_at: new Date().toISOString(),
          })

          if (error) throw error
          toast.success("Recipient address added successfully")
        }
      } else {
        // Map form data to database schema for shipping addresses
        const shippingData = {
          user_id: user.id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          address_line1: data.street_address,
          address_line2: data.street_address_2 || null,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          country_code: data.country_code,
          address_type: data.address_type,
          usage_type: (data as ShippingAddressFormData).usage_type,
          is_default: data.is_default || false,
          updated_at: new Date().toISOString(),
        }

        if (editingAddress) {
          // Update existing shipping address
          const { error } = await supabase.from("shipping_addresses").update(shippingData).eq("id", editingAddress.id)

          if (error) throw error
          toast.success("Shipping address updated successfully")
        } else {
          // Create new shipping address
          const { error } = await supabase.from("shipping_addresses").insert({
            ...shippingData,
            created_at: new Date().toISOString(),
          })

          if (error) throw error
          toast.success("Shipping address added successfully")
        }
      }

      await loadAddresses()
    } catch (error) {
      console.error("Error saving address:", error)
      toast.error("Failed to save address")
      throw error
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      if (activeTab === "recipient") {
        const { error } = await supabase.from("recipient_addresses").delete().eq("id", id)

        if (error) throw error
        toast.success("Recipient address deleted successfully")
      } else {
        const { error } = await supabase.from("shipping_addresses").delete().eq("id", id)

        if (error) throw error
        toast.success("Shipping address deleted successfully")
      }

      await loadAddresses()
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error("Failed to delete address")
      throw error
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Address Book</h1>
          <p className="text-gray-600 mt-1">Manage your shipping and recipient addresses</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="recipient">My Recipient Addresses</TabsTrigger>
            <TabsTrigger value="shipping">My From Addresses</TabsTrigger>
          </TabsList>

          <Button onClick={handleAddAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === "recipient" ? "Recipient" : "Shipping"} Address
          </Button>
        </div>

        <TabsContent value="recipient" className="space-y-6">
          <AddressList
            addresses={recipientAddresses}
            countries={countries}
            type="recipient"
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <AddressList
            addresses={shippingAddresses}
            countries={countries}
            type="shipping"
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <AddressForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitAddress}
        type={activeTab as "recipient" | "shipping"}
        editingAddress={editingAddress}
        countries={countries}
        userProfile={userProfile}
      />
    </div>
  )
}
