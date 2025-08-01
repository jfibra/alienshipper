"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function MagicLinkPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleMagic = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const res = await fetch("/api/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send magic link")
      setSuccess("Magic link sent! Check your inbox.")
    } catch (err: any) {
      setError(err.message || "Failed to send magic link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <form onSubmit={handleMagic} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Magic Link Login</h1>
        {success && <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-center">{success}</div>}
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-center">{error}</div>}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>
        <div className="flex justify-between text-sm mt-2">
          <Link href="/login" className="text-purple-600 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  )
}
