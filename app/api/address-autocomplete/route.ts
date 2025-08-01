import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] })
    }

    // Limit query length to prevent API errors
    const limitedQuery = query.slice(0, 100)

    const apiKey = process.env.LOCATION_IQ_API_KEY
    if (!apiKey) {
      console.error("LOCATION_IQ_API_KEY is not set")
      return NextResponse.json({ suggestions: [] })
    }

    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(limitedQuery)}&format=json&limit=5&addressdetails=1&countrycodes=us,ca`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "AlienShipper/1.0",
        Referer: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Handle "Unable to geocode" errors gracefully
        return NextResponse.json({ suggestions: [] })
      }
      throw new Error(`LocationIQ API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle API error responses
    if (data.error) {
      console.warn("LocationIQ API error:", data.error)
      return NextResponse.json({ suggestions: [] })
    }

    // Ensure data is an array
    const results = Array.isArray(data) ? data : []

    const suggestions = results.map((item: any) => ({
      place_id: item.place_id || item.osm_id || Math.random().toString(),
      display_name: item.display_name,
      address: {
        house_number: item.address?.house_number || "",
        road: item.address?.road || "",
        city: item.address?.city || item.address?.town || item.address?.village || "",
        state: item.address?.state || "",
        postcode: item.address?.postcode || "",
        country: item.address?.country || "",
      },
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Address autocomplete error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
