"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Shield, Zap, Globe, Star, ArrowRight, CheckCircle, TrendingDown, Package, Users } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle password reset callback
    const token = searchParams.get("token")
    const type = searchParams.get("type")
    const error = searchParams.get("error")

    if (token && type === "recovery") {
      // Redirect to reset password page with the token
      router.push(`/auth/reset-password?access_token=${token}&type=${type}`)
      return
    }

    if (error) {
      // Handle other auth errors
      console.error("Auth error:", error)
    }
  }, [router, searchParams])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
                🚀 Save up to 89% on shipping costs
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Cosmic Shipping
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Solutions
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Harness alien technology to revolutionize your shipping experience. Get instant quotes from multiple
                carriers and save big on every shipment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                >
                  <Link href="/calculator" className="flex items-center">
                    Get Instant Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 bg-transparent"
                >
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <Image
                src="/images/alien-delivery-ship.png"
                alt="Alien Delivery Ship"
                width={600}
                height={400}
                className="relative z-10 w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">89%</div>
              <div className="text-gray-600">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-gray-600">Packages Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose AlienShipper?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced alien technology provides unmatched shipping solutions that are out of this world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Lightning Fast Delivery</CardTitle>
                <CardDescription>
                  Quantum-powered logistics ensure your packages arrive faster than light speed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Galactic Security</CardTitle>
                <CardDescription>
                  Advanced alien encryption protects your shipments across all dimensions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Massive Savings</CardTitle>
                <CardDescription>
                  Save up to 89% on shipping costs with our alien technology optimization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Universal Coverage</CardTitle>
                <CardDescription>
                  Ship anywhere in the galaxy with our extensive network of alien carriers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Instant Quotes</CardTitle>
                <CardDescription>Get real-time shipping rates from multiple carriers in milliseconds.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Our alien support team is available around the clock across all time zones.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, fast, and efficient. Get your packages delivered in just a few clicks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Enter Package Details</h3>
              <p className="text-gray-600">
                Simply input your package dimensions, weight, and destination to get started.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Compare Rates</h3>
              <p className="text-gray-600">
                Our alien AI instantly compares rates from multiple carriers to find the best deal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Ship & Track</h3>
              <p className="text-gray-600">
                Book your shipment and track it in real-time with our advanced tracking system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Save on Shipping?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already saving money with our alien shipping technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 bg-transparent"
            >
              <Link href="/calculator">Calculate Savings</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
