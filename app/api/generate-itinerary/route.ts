import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { GoogleGenerativeAI } from "@google/generative-ai"

const planSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  numDays: z
    .string()
    .or(z.number())
    .transform((val) => Number(val)),
  preference: z.string().min(1, "Preference is required"),
})

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = cookies().get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = planSchema.parse(body)

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create prompt for Gemini
    const prompt = `
      Create a detailed travel itinerary for a trip to ${validatedData.destination}.
      Trip details:
      - Start date: ${validatedData.startDate}
      - End date: ${validatedData.endDate}
      - Duration: ${validatedData.numDays} days
      - Preference: ${validatedData.preference}
      
      Please provide a comprehensive travel plan including:
      1. A brief summary of the trip
      2. A day-by-day breakdown of activities
      3. Popular attractions to visit with brief descriptions
      4. Dining options (restaurants, cafes, etc.)
      5. Local experiences and activities
      6. Transportation suggestions within the destination
      7. Accommodation recommendations
      
      Format the response as a structured JSON object with the following keys:
      - destination
      - startDate
      - endDate
      - numDays
      - summary (brief overview of the trip)
      - dailyPlan (object with day numbers as keys and daily activities)
      - attractions (array of objects with name, description, and tips)
      - dining (array of objects with name, cuisine, and description)
      - experiences (array of objects with name, description, and duration)
      - transportation (array of objects with type and description)
      - accommodation (array of objects with name, type, priceRange, and description)
    `

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response from Gemini
    // The response might be wrapped in ```json ``` markdown code blocks
    let jsonStr = text
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0].trim()
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0].trim()
    }

    let itinerary
    try {
      itinerary = JSON.parse(jsonStr)
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
      return NextResponse.json({ message: "Failed to parse AI response" }, { status: 500 })
    }

    // Add the original request data if missing
    itinerary.destination = itinerary.destination || validatedData.destination
    itinerary.startDate = itinerary.startDate || validatedData.startDate
    itinerary.endDate = itinerary.endDate || validatedData.endDate
    itinerary.numDays = itinerary.numDays || validatedData.numDays

    return NextResponse.json({ itinerary })
  } catch (error) {
    console.error("Generate itinerary error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Failed to generate itinerary" }, { status: 500 })
  }
}

