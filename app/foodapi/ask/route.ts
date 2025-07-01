import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`)
  const data = await res.json()

  return NextResponse.json(data)
}
