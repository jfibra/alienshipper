"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { useUserSession } from "@/hooks/use-user-session"
import { LogOut, Settings, User, Package, Truck, CreditCard, BookOpen, HelpCircle, Home } from "lucide-react"

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Create Shipment", href: "/dashboard/create-shipment", icon: Package },
  { name: "Shipment Tracker", href: "/dashboard/shipment-tracker", icon: Truck },
  { name: "Address Book", href: "/dashboard/address-book", icon: BookOpen },
  { name: "Postage", href: "/dashboard/postage", icon: Package },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUserSession()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const supabase = createClientComponentClient()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clear any additional session data
      await fetch("/api/logout", { method: "POST" })

      // Clear local storage
      localStorage.removeItem("user")

      // Redirect to login
      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      // Force redirect even if there's an error
      router.replace("/login")
    } finally {
      setIsSigningOut(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/android-chrome-192x192.png" alt="AlienShipper" className="w-8 h-8" />
            <span className="text-xl font-bold text-purple-700">AlienShipper</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium transition-colors group"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-200"
          >
            {isSigningOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
