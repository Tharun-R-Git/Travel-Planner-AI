import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { z } from "zod"

const itinerarySchema = z.object({
  days: z.array(
    z.object({
      day: z.number(),
      activities: z.array(
        z.object({
          time: z.string(),
          activity: z.string(),
          description: z.string(),
        })
      ),
    })
  ),
})

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = cookies().get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = itinerarySchema.parse(body)

    // Connect to database
    const { db } = await connectToDatabase()

    // Save itinerary
    const result = await db.collection("itineraries").insertOne({
      userId: decoded.userId,
      itinerary: validatedData,
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "Itinerary saved successfully",
      itineraryId: result.insertedId,
    })
  } catch (error) {
    console.error("Error in /api/save-itinerary:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

