import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Package, MapPin, Zap } from "lucide-react"

export default function CalculatorPage() {
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from-zip">ZIP Code</Label>
                    <Input id="from-zip" placeholder="10001" />
                  </div>
                  <div>
                    <Label htmlFor="from-country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="United States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="mx">Mexico</SelectItem>
                        <SelectItem value="mars">Mars</SelectItem>
                        <SelectItem value="jupiter">Jupiter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ship To
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="to-zip">ZIP Code</Label>
                    <Input id="to-zip" placeholder="90210" />
                  </div>
                  <div>
                    <Label htmlFor="to-country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="United States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="mx">Mexico</SelectItem>
                        <SelectItem value="mars">Mars</SelectItem>
                        <SelectItem value="jupiter">Jupiter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input id="weight" placeholder="1.0" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="value">Package Value ($)</Label>
                    <Input id="value" placeholder="100.00" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length">Length (in)</Label>
                    <Input id="length" placeholder="12" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (in)</Label>
                    <Input id="width" placeholder="8" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (in)</Label>
                    <Input id="height" placeholder="6" type="number" />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6">
                <Zap className="w-5 h-5 mr-2" />
                Calculate Rates
              </Button>
            </CardContent>
          </Card>

          {/* Results Preview */}
          <div className="space-y-8">
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
                <h3 className="text-2xl font-semibold text-gray-900">Quantum Calculator Initializing...</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our alien engineers are calibrating the quantum processors. Fill out the form to get instant shipping
                  quotes from multiple carriers.
                </p>
              </CardContent>
            </Card>

            {/* Sample Results */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Sample Results Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">USPS Priority Mail</div>
                    <div className="text-sm text-gray-600">1-3 business days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">$6.20</div>
                    <div className="text-sm text-gray-500 line-through">$8.95</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">UPS Ground</div>
                    <div className="text-sm text-gray-600">1-5 business days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">$7.89</div>
                    <div className="text-sm text-gray-500 line-through">$12.45</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">FedEx Express</div>
                    <div className="text-sm text-gray-600">1-2 business days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">$15.20</div>
                    <div className="text-sm text-gray-500 line-through">$24.50</div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">* Sample rates shown. Actual rates calculated in real-time.</p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculator Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">Real-time rates from all major carriers</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Instant quotes in milliseconds</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">International shipping support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-gray-700">Dimensional weight calculations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700">Insurance and signature options</span>
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
