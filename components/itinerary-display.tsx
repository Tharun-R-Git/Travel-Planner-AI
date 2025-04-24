"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ItineraryDisplayProps {
  itinerary: {
    days: Array<{
      day: number
      activities: Array<{
        time: string
        activity: string
        description: string
      }>
    }>
  }
  onSave: () => void
}

export default function ItineraryDisplay({ itinerary, onSave }: ItineraryDisplayProps) {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {itinerary.days.map((day) => (
          <Card key={day.day} className="mb-4">
            <CardHeader>
              <CardTitle>Day {day.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 font-medium">{activity.time}</div>
                    <div>
                      <h4 className="font-medium">{activity.activity}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
      <Button onClick={onSave} className="w-full">
        Save Itinerary
      </Button>
    </div>
  )
}

