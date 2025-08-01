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
  city: string
  state: string
  postal_code: string
  country: string
  country_code: string
  address_type: "residential" | "commercial" | "warehouse" | "government" | "pickup_point" | "other"
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export interface RecipientAddress extends BaseAddress {
  phone_number?: string
  street1: string
  street2?: string
}

export interface ShippingAddress extends BaseAddress {
  phone?: string
  address_line1: string
  address_line2?: string
  usage_type: "shipping" | "return" | "both"
}

export type AddressFormData = Omit<BaseAddress, "id" | "user_id" | "created_at" | "updated_at"> & {
  street_address: string
  street_address_2?: string
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
