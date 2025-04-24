import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Create response
    const response = new NextResponse(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    // Clear cookie
    response.cookies.delete("auth_token")

    return response
  } catch (error) {
    console.error("Error in /api/auth/logout:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

