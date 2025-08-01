import { z } from "zod"

const baseAddressSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  street_address: z.string().min(1, "Street address is required"),
  street_address_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  country_code: z.string().min(2, "Country code is required"),
  address_type: z.enum(["residential", "commercial", "warehouse", "government", "pickup_point", "other"]),
  is_default: z.boolean().optional(),
})

export const recipientAddressSchema = baseAddressSchema

export const shippingAddressSchema = baseAddressSchema.extend({
  usage_type: z.enum(["shipping", "return", "both"]),
})

export type RecipientAddressFormData = z.infer<typeof recipientAddressSchema>
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>
