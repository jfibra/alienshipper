import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const countryCode = searchParams.get("countrycode") || "US"

  if (!query || query.trim().length < 3) {
    return NextResponse.json({ suggestions: [] })
  }

  // Limit query length to prevent API errors
  const limitedQuery = query.trim().slice(0, 100)

  try {
    const apiKey = process.env.LOCATION_IQ_API_KEY
    if (!apiKey) {
      console.error("LocationIQ API key not found")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const url = new URL("https://us1.locationiq.com/v1/search.php")
    url.searchParams.set("key", apiKey)
    url.searchParams.set("q", limitedQuery)
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "5")
    url.searchParams.set("addressdetails", "1")
    url.searchParams.set("countrycodes", countryCode.toLowerCase())

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "AlienShipper/1.0",
        Referer: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty results for 404 instead of error
        return NextResponse.json({ suggestions: [] })
      }
      if (response.status === 429) {
        return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 })
      }
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    // Handle API error responses
    if (data.error) {
      console.log("LocationIQ API error:", data.error)
      return NextResponse.json({ suggestions: [] })
    }

    // Ensure data is an array
    const results = Array.isArray(data) ? data : []

    const suggestions = results.map((item: any, index: number) => ({
      place_id: item.place_id || `${item.lat}-${item.lon}-${index}`,
      display_name: item.display_name,
      address: {
        house_number: item.address?.house_number,
        road: item.address?.road,
        city: item.address?.city || item.address?.town || item.address?.village,
        state: item.address?.state,
        postcode: item.address?.postcode,
        country: item.address?.country,
        country_code: item.address?.country_code,
      },
      lat: item.lat,
      lon: item.lon,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("LocationIQ API error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
