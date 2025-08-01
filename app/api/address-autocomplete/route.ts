import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const countryCode = searchParams.get("countrycodes") || "US"

    if (!query || query.length < 3) {
      return NextResponse.json({ error: "Query must be at least 3 characters" }, { status: 400 })
    }

    const apiKey = process.env.LOCATION_IQ_API_KEY
    if (!apiKey) {
      console.error("LocationIQ API key missing. Make sure LOCATION_IQ_API_KEY is set in your environment variables.")
      return NextResponse.json({ error: "LocationIQ API key not configured" }, { status: 500 })
    }

    const url = `https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(
      query,
    )}&format=json&limit=5&countrycodes=${countryCode.toLowerCase()}&addressdetails=1`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "AlienShipper/1.0",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`LocationIQ API Error ${response.status}:`, errorText)

      if (response.status === 401) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }

      return NextResponse.json({ error: `API request failed: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()

    // Transform the response to match our expected format
    const transformedSuggestions = Array.isArray(data)
      ? data.map((item: any) => ({
          place_id: item.place_id,
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          address: {
            house_number: item.address?.house_number || "",
            road: item.address?.road || "",
            city: item.address?.city || item.address?.town || item.address?.village || "",
            state: item.address?.state || "",
            postcode: item.address?.postcode || "",
            country: item.address?.country || "",
            country_code: item.address?.country_code?.toUpperCase() || countryCode.toUpperCase(),
          },
        }))
      : []

    return NextResponse.json(transformedSuggestions)
  } catch (error) {
    console.error("Address search error:", error)
    return NextResponse.json({ error: "Failed to search addresses" }, { status: 500 })
  }
}
