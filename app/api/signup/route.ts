import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error("Supabase environment variables are not set.")
}

const supabase = createClient(supabaseUrl, supabaseServiceRole)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      password,
      firstName,
      lastName,
      company,
      phone,
      businessType,
      monthlyVolume,
      agreedTerms,
      newsletter,
    } = body

    if (!email || !password || !firstName || !lastName || !agreedTerms) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    })
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
    const userId = authUser.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Failed to create user." }, { status: 500 })
    }

    // 2. Insert extra info into users table
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      company,
      phone,
      business_type: businessType,
      monthly_shipping_volume: monthlyVolume,
      agreed_terms: agreedTerms,
      newsletter_opt_in: newsletter,
    })
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Signup failed" }, { status: 500 })
  }
}