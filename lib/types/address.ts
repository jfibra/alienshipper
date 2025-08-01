export interface Country {
  code: string
  name: string
}

export interface UserProfile {
  id: string
  full_name?: string
  email?: string
  phone?: string
  company?: string
}

export interface BaseAddress {
  id?: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  company?: string
  street_address: string
  street_address_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  address_type: "residential" | "warehouse" | "office" | "business" | "other"
  created_at?: string
  updated_at?: string
}

export interface RecipientAddress extends BaseAddress {}

export interface ShippingAddress extends BaseAddress {
  usage_type: "shipping" | "return" | "both"
}

export type AddressFormData = Omit<BaseAddress, "id" | "user_id" | "created_at" | "updated_at"> & {
  usage_type?: "shipping" | "return" | "both"
}

export interface LocationIQSuggestion {
  place_id: string
  display_name: string
  address: {
    house_number?: string
    road?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}
