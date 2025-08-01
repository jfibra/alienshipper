import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, CheckCircle, Zap, Shield, Globe } from "lucide-react"

export default function SignupPage() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "No Setup Fees",
      description: "Get started immediately with zero upfront costs",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Start shipping and saving within minutes of signing up",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your data is protected with alien-grade encryption",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access to shipping carriers across the entire galaxy",
    },
  ]

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Join the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Shipping Revolution
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Start saving up to 89% on shipping costs with our alien technology. No setup fees, no monthly charges,
                just incredible savings from day one.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you get instantly:</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Access to discounted shipping rates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Batch label creation tools</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Real-time package tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">24/7 alien support team</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <Card className="p-8 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Create Your Free Account</CardTitle>
              <p className="text-gray-600">Join thousands of businesses saving on shipping costs</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Acme Corp" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyVolume">Monthly Shipping Volume</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your monthly volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50 packages</SelectItem>
                    <SelectItem value="51-200">51-200 packages</SelectItem>
                    <SelectItem value="201-500">201-500 packages</SelectItem>
                    <SelectItem value="501-1000">501-1000 packages</SelectItem>
                    <SelectItem value="1000+">1000+ packages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <Label htmlFor="newsletter" className="text-sm text-gray-600">
                  Send me shipping tips and product updates via intergalactic communication
                </Label>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6">
                Launch My Account
                <Rocket className="w-5 h-5 ml-2" />
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="#" className="text-purple-600 hover:underline font-semibold">
                  Sign in here
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-8">Trusted by over 10,000 businesses across the galaxy</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-60">
            <div className="text-2xl font-bold text-gray-400">COSMIC CORP</div>
            <div className="text-2xl font-bold text-gray-400">STELLAR INC</div>
            <div className="text-2xl font-bold text-gray-400">GALAXY CO</div>
            <div className="text-2xl font-bold text-gray-400">NEBULA LLC</div>
          </div>
        </div>
      </div>
    </div>
  )
}
