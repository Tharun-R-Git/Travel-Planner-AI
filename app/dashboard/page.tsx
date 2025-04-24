"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import TravelPlanForm from "@/components/travel-plan-form"
import ItineraryDisplay from "@/components/itinerary-display"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handlePlanSubmit = async (planData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate itinerary")
      }

      const data = await response.json()
      setItinerary(data.itinerary)
      toast({
        title: "Itinerary generated",
        description: "Your travel plan is ready!",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate itinerary",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveItinerary = async () => {
    try {
      await fetch("/api/save-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itinerary }),
      })

      toast({
        title: "Itinerary saved",
        description: "Your travel plan has been saved to your account",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save your itinerary",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Travel Planner</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a Travel Plan</CardTitle>
            <CardDescription>Fill in the details to generate your personalized travel itinerary</CardDescription>
          </CardHeader>
          <CardContent>
            <TravelPlanForm onSubmit={handlePlanSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        {itinerary && (
          <Card>
            <CardHeader>
              <CardTitle>Your Travel Itinerary</CardTitle>
              <CardDescription>AI-generated travel plan based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <ItineraryDisplay itinerary={itinerary} onSave={handleSaveItinerary} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

