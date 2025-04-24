import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/api/generate-itinerary", "/api/save-itinerary"]

// Paths that should redirect to dashboard if already authenticated
const authPaths = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp))
  const isAuthPath = authPaths.some((ap) => path === ap)

  // Verify token
  let isAuthenticated = false
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
      isAuthenticated = true
    } catch (error) {
      isAuthenticated = false
    }
  }

  // Redirect logic
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to login if trying to access protected path without authentication
    const url = new URL("/login", request.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  if (isAuthPath && isAuthenticated) {
    // Redirect to dashboard if already authenticated and trying to access login/register
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/login", "/register", "/api/generate-itinerary", "/api/save-itinerary"],
}

