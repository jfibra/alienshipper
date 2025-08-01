"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ConfirmSignupPage() {
  const router = useRouter()
  const params = useSearchParams()
  useEffect(() => {
    // Optionally, you could call an API to confirm the signup
    setTimeout(() => {
      router.replace("/login?confirmed=1")
    }, 2000)
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Email Confirmed!</h1>
        <p className="text-gray-700 mb-4">Your email has been confirmed. Redirecting...</p>
        <div className="animate-spin h-8 w-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  )
}
