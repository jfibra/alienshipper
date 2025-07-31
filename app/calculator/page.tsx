"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Package, MapPin, Zap, Loader2 } from "lucide-react"

interface ParcelType {
  id: string
  name: string
  carrier: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

interface ShippingRate {
  carrier: string
  service: string
  amount: string
  currency: string
  estimated_days: number
  retail_rate?: string
}

const presetParcels: ParcelType[] = [
  // USPS
  { id: "USPS_FlatRateEnvelope", name: "Flat Rate Envelope", carrier: "USPS" },
  { id: "USPS_FlatRateLegalEnvelope", name: "Flat Rate Legal Envelope", carrier: "USPS" },
  { id: "USPS_FlatRatePaddedEnvelope", name: "Flat Rate Padded Envelope", carrier: "USPS" },
  { id: "USPS_SmallFlatRateBox", name: "Small Flat Rate Box", carrier: "USPS" },
  { id: "USPS_MediumFlatRateBox", name: "Medium Flat Rate Box", carrier: "USPS" },
  { id: "USPS_LargeFlatRateBox", name: "Large Flat Rate Box", carrier: "USPS" },

  // UPS
  { id: "UPS_Box_10kg", name: "UPS Box 10kg", carrier: "UPS" },
  { id: "UPS_Box_25kg", name: "UPS Box 25kg", carrier: "UPS" },
  { id: "UPS_Express_Box", name: "UPS Express Box", carrier: "UPS" },
  { id: "UPS_Express_Box_Large", name: "UPS Express Box Large", carrier: "UPS" },
  { id: "UPS_Express_Envelope", name: "UPS Express Envelope", carrier: "UPS" },
  { id: "UPS_Express_Hard_Pak", name: "UPS Express Hard Pak", carrier: "UPS" },
  { id: "UPS_Express_Legal_Envelope", name: "UPS Express Legal Envelope", carrier: "UPS" },
  { id: "UPS_Express_Pak", name: "UPS Express Pak", carrier: "UPS" },
  { id: "UPS_Express_Tube", name: "UPS Express Tube", carrier: "UPS" },
  { id: "UPS_Laboratory_Pak", name: "UPS Laboratory Pak", carrier: "UPS" },
  { id: "UPS_MI_BPM", name: "UPS MI BPM", carrier: "UPS" },
  { id: "UPS_MI_BPM_Flat", name: "UPS MI BPM Flat", carrier: "UPS" },
  { id: "UPS_MI_BPM_Tube", name: "UPS MI BPM Tube", carrier: "UPS" },
  { id: "UPS_MI_First_Class", name: "UPS MI First Class", carrier: "UPS" },
  { id: "UPS_MI_Flat", name: "UPS MI Flat", carrier: "UPS" },
  { id: "UPS_MI_Irregular", name: "UPS MI Irregular", carrier: "UPS" },
  { id: "UPS_MI_Machinable", name: "UPS MI Machinable", carrier: "UPS" },
  { id: "UPS_MI_MEDIA_MAIL", name: "UPS MI Media Mail", carrier: "UPS" },
  { id: "UPS_MI_Parcel_Post", name: "UPS MI Parcel Post", carrier: "UPS" },
  { id: "UPS_MI_Priority", name: "UPS MI Priority", carrier: "UPS" },
  { id: "UPS_MI_Priority_Flat", name: "UPS MI Priority Flat", carrier: "UPS" },
  { id: "UPS_MI_Priority_Pak", name: "UPS MI Priority Pak", carrier: "UPS" },
  { id: "UPS_Pad_Pak", name: "UPS Pad Pak", carrier: "UPS" },
  { id: "UPS_Pallet", name: "UPS Pallet", carrier: "UPS" },

  // FedEx
  { id: "FedEx_Box_10kg", name: "FedEx Box 10kg", carrier: "FedEx" },
  { id: "FedEx_Box_25kg", name: "FedEx Box 25kg", carrier: "FedEx" },
  { id: "FedEx_Box_Extra_Large_1", name: "FedEx Box Extra Large 1", carrier: "FedEx" },
  { id: "FedEx_Box_Extra_Large_2", name: "FedEx Box Extra Large 2", carrier: "FedEx" },
  { id: "FedEx_Box_Large_1", name: "FedEx Box Large 1", carrier: "FedEx" },
  { id: "FedEx_Box_Large_2", name: "FedEx Box Large 2", carrier: "FedEx" },
  { id: "FedEx_Box_Medium_1", name: "FedEx Box Medium 1", carrier: "FedEx" },
  { id: "FedEx_Box_Medium_2", name: "FedEx Box Medium 2", carrier: "FedEx" },
  { id: "FedEx_Box_Small_1", name: "FedEx Box Small 1", carrier: "FedEx" },
  { id: "FedEx_Box_Small_2", name: "FedEx Box Small 2", carrier: "FedEx" },
  { id: "FedEx_Envelope", name: "FedEx Envelope", carrier: "FedEx" },
  { id: "FedEx_Padded_Pak", name: "FedEx Padded Pak", carrier: "FedEx" },
  { id: "FedEx_Pak", name: "FedEx Pak", carrier: "FedEx" },
  { id: "FedEx_Tube", name: "FedEx Tube", carrier: "FedEx" },
]

export default function CalculatorPage() {
  const [fromZip, setFromZip] = useState("")
  const [toZip, setToZip] = useState("")
  const [weight, setWeight] = useState("")
  const [parcelType, setParcelType] = useState("")
  const [customDimensions, setCustomDimensions] = useState({
    length: "",
    width: "",
    height: "",
  })
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalculateRates = async () => {
    if (!fromZip || !toZip || !weight) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")
    setRates([])

    try {
      const parcelData: any = {
        weight: Number(weight),
        mass_unit: "oz",
      }

      if (parcelType === "custom") {
        if (!customDimensions.length || !customDimensions.width || !customDimensions.height) {
          setError("Please provide custom dimensions")
          setLoading(false)
          return
        }
        parcelData.length = customDimensions.length
        parcelData.width = customDimensions.width
        parcelData.height = customDimensions.height
        parcelData.distance_unit = "in"
      } else if (parcelType) {
        parcelData.template = parcelType
      }

      const shipmentData = {
        address_from: {
          zip: fromZip,
          country: "US",
        },
        address_to: {
          zip: toZip,
          country: "US",
        },
        parcels: [parcelData],
      }

      const response = await fetch("/api/calculate-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate rates")
      }

      setRates(data.rates || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const groupedParcels = presetParcels.reduce(
    (acc, parcel) => {
      if (!acc[parcel.carrier]) {
        acc[parcel.carrier] = []
      }
      acc[parcel.carrier].push(parcel)
      return acc
    },
    {} as Record<string, ParcelType[]>,
  )

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Cosmic Shipping Calculator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate shipping costs across the universe with our quantum-powered calculator. Get instant quotes from
            multiple carriers and save up to 89% on shipping rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Calculator Form */}
          <Card className="p-8">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Get Instant Shipping Quotes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Address */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ship From
                </Label>
                <div>
                  <Label htmlFor="from-zip">ZIP Code *</Label>
                  <Input
                    id="from-zip"
                    placeholder="10001"
                    value={fromZip}
                    onChange={(e) => setFromZip(e.target.value)}
                  />
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ship To
                </Label>
                <div>
                  <Label htmlFor="to-zip">ZIP Code *</Label>
                  <Input id="to-zip" placeholder="90210" value={toZip} onChange={(e) => setToZip(e.target.value)} />
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Package Details
                </Label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (oz) *</Label>
                    <Input
                      id="weight"
                      placeholder="1.0"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="parcel-type">Parcel Type</Label>
                  <Select value={parcelType} onValueChange={setParcelType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parcel type or use custom dimensions" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(groupedParcels).map(([carrier, parcels]) => (
                        <div key={carrier}>
                          <div className="px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100">{carrier}</div>
                          {parcels.map((parcel) => (
                            <SelectItem key={parcel.id} value={parcel.id}>
                              {parcel.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                      <div className="px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100">Custom</div>
                      <SelectItem value="custom">Custom Parcel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {parcelType === "custom" && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="length">Length (in) *</Label>
                      <Input
                        id="length"
                        placeholder="12"
                        type="number"
                        step="0.1"
                        value={customDimensions.length}
                        onChange={(e) => setCustomDimensions((prev) => ({ ...prev, length: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (in) *</Label>
                      <Input
                        id="width"
                        placeholder="8"
                        type="number"
                        step="0.1"
                        value={customDimensions.width}
                        onChange={(e) => setCustomDimensions((prev) => ({ ...prev, width: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (in) *</Label>
                      <Input
                        id="height"
                        placeholder="6"
                        type="number"
                        step="0.1"
                        value={customDimensions.height}
                        onChange={(e) => setCustomDimensions((prev) => ({ ...prev, height: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCalculateRates}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Calculate Rates
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-8">
            {loading ? (
              <Card className="p-8">
                <CardContent className="text-center space-y-6">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900">Calculating Rates...</h3>
                  <p className="text-gray-600">Our alien technology is finding the best rates across the galaxy...</p>
                </CardContent>
              </Card>
            ) : rates.length > 0 ? (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Shipping Rates ({rates.length} options found)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {rate.carrier} {rate.service}
                        </div>
                        <div className="text-sm text-gray-600">
                          {rate.estimated_days ? `${rate.estimated_days} business days` : "Delivery time varies"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${Number.parseFloat(rate.amount).toFixed(2)}
                        </div>
                        {rate.retail_rate && Number.parseFloat(rate.retail_rate) > Number.parseFloat(rate.amount) && (
                          <div className="text-sm text-gray-500 line-through">
                            ${Number.parseFloat(rate.retail_rate).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      * Rates shown are discounted AlienShipper prices. Actual delivery times may vary.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url('/images/abstract-ecommerce-flow.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <CardContent className="text-center space-y-6 relative z-10">
                  <div className="text-6xl mb-4">🛸</div>
                  <h3 className="text-2xl font-semibold text-gray-900">No Rates Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Sorry, we couldn't find any shipping rates for your selected parcel and destination.<br />
                    <br />
                    This can happen if:<br />
                    - The selected parcel type is not supported for the chosen carrier or route.<br />
                    - The weight or dimensions are outside the allowed range.<br />
                    - The carrier does not serve the selected ZIP codes.<br />
                    <br />
                    <b>How to proceed:</b><br />
                    • Try a different parcel type or adjust the weight/dimensions.<br />
                    • Double-check the ZIP codes.<br />
                    • If you continue to have issues, contact support for help.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card className="p-6">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculator Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">Real-time rates from USPS, UPS, and FedEx</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Preset parcel types for easy selection</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Custom dimensions support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-gray-700">Instant alien-negotiated discounts</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700">Compare multiple shipping options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
