"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Create Shipment", href: "/dashboard/create-shipment" },
  { name: "Shipment Tracker", href: "/dashboard/shipment-tracker" },
  { name: "Address Book", href: "/dashboard/address-book" },
  { name: "Postage", href: "/dashboard/postage" },
  { name: "Billing", href: "/dashboard/billing" },
  { name: "Profile", href: "/dashboard/profile" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Support", href: "/dashboard/support" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check session
    fetch("/api/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.replace("/login")
        else setUser(data.user)
      })
      .catch(() => router.replace("/login"))
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    router.replace("/login")
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <span className="text-xl font-bold text-purple-700">AlienShipper</span>
        </div>
        <nav className="flex-1 space-y-2">
          {menu.map(item => (
            <Link key={item.href} href={item.href} className="block px-3 py-2 rounded hover:bg-purple-50 text-gray-700 font-medium">
              {item.name}
            </Link>
          ))}
        </nav>
        <Button onClick={handleLogout} className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600">Logout</Button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
