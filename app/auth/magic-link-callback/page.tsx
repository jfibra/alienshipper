"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function MagicLinkCallbackPage() {
  const [status, setStatus] = useState("Logging you in via magic link...")
  const router = useRouter()
  useEffect(() => {
    // Simulate magic link login
    setTimeout(() => {
      setStatus("Success! Redirecting to dashboard...")
      router.replace("/dashboard")
    }, 2000)
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-2">{status}</h1>
        <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  )
}
