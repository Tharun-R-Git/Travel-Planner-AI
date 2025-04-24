import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Get user data
    const user = await db.collection("users").findOne(
      { _id: decoded.userId },
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Error in /api/auth/me:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

