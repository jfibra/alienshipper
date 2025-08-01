"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { useUserSession } from "@/hooks/use-user-session"
import {
  LogOut,
  Settings,
  User,
  Package,
  Truck,
  CreditCard,
  BookOpen,
  HelpCircle,
  Home,
  ChevronRight,
  Zap,
} from "lucide-react"

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
  const pathname = usePathname()
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-blue-400 border-b-transparent rounded-full animate-spin mx-auto opacity-60"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="text-purple-200 font-medium">Loading your intergalactic dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-r border-purple-500/20 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Cosmic background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-400/10 to-transparent"></div>

        {/* Logo */}
        <div className="relative p-6 border-b border-purple-500/20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/images/android-chrome-192x192.png"
                alt="AlienShipper"
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg group-hover:bg-purple-400/40 transition-colors duration-300"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AlienShipper
              </span>
              <div className="text-xs text-purple-300/70 font-medium">Intergalactic Shipping</div>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="relative p-4 border-b border-purple-500/20">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.email}</p>
              <p className="text-xs text-purple-300/80 flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Active Captain
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 relative">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-400/30 shadow-lg"
                    : "text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 hover:text-white hover:border hover:border-purple-400/20"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>
                )}
                <Icon
                  className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                    isActive ? "text-purple-300" : "text-purple-400 group-hover:text-purple-300"
                  }`}
                />
                <span className="relative z-10 flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-purple-300 relative z-10" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="relative p-4 border-t border-purple-500/20">
          <Button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="w-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-red-400/20 hover:border-red-400/40"
          >
            {isSigningOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Departing Ship...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Leave Ship
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-purple-900/50"></div>
        <div className="relative z-10 p-8">{children}</div>
      </main>
    </div>
  )
}
