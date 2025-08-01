"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Sign In</h1>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-center">{error}</div>}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <div className="flex justify-between text-sm mt-2">
          <Link href="/forgot-password" className="text-purple-600 hover:underline">Forgot password?</Link>
          <Link href="/magic-link" className="text-purple-600 hover:underline">Magic Link</Link>
        </div>
        <div className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account? <Link href="/signup" className="text-purple-600 hover:underline font-semibold">Sign up</Link>
        </div>
      </form>
    </div>
  )
}
