import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.locationiq.com/v1/autocomplete?key=${process.env.LOCATION_IQ_API_KEY}&q=${encodeURIComponent(query)}&limit=5&format=json`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Address autocomplete error:", error)
    return NextResponse.json({ error: "Failed to fetch address suggestions" }, { status: 500 })
  }
}
