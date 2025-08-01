import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { accessToken, password } = await request.json()

    if (!accessToken || !password) {
      return NextResponse.json({ error: "Access token and password are required" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Update user password using the access token
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.error("Supabase reset password error:", error)
      return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 400 })
    }

    return NextResponse.json({
      message: "Password reset successfully",
      user: data.user,
    })
  } catch (error) {
    console.error("Reset password API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
