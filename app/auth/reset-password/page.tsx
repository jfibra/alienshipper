"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const accessToken = params.get("access_token")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!password || password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reset password")
      setSuccess("Password reset! Redirecting to login...")
      setTimeout(() => router.replace("/login"), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleReset} className="bg-white p-8 rounded shadow w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-center">{error}</div>}
        {success && <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-center">{success}</div>}
        <div>
          <Input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <Input type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  )
}
