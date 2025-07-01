// app/foodapi/ask/route.ts

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const query = body.query

  // call your external food API here (like Open Food Facts or Nutritionix)
  const result = await fetch(`https://api.example.com/search?food=${query}`)
  const nutrition = await result.json()

  return NextResponse.json(nutrition)
}
