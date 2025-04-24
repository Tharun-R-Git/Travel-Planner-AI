"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface TravelPlanFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
}

export default function TravelPlanForm({ onSubmit, isLoading }: TravelPlanFormProps) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    numDays: "",
    preference: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Calculate number of days when dates change
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate).getTime()
      const end = new Date(formData.endDate).getTime()
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      setFormData((prev) => ({ ...prev, numDays: diffDays.toString() }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Enter your destination"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => {
              handleChange(e)
              calculateDays()
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => {
              handleChange(e)
              calculateDays()
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numDays">Number of Days</Label>
        <Input
          id="numDays"
          name="numDays"
          type="number"
          min="1"
          value={formData.numDays}
          onChange={handleChange}
          placeholder="Enter number of days"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preference">Travel Preferences</Label>
        <Select
          value={formData.preference}
          onValueChange={(value) => handleSelectChange("preference", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your preferences" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adventure">Adventure & Outdoor</SelectItem>
            <SelectItem value="cultural">Cultural & Historical</SelectItem>
            <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
            <SelectItem value="food">Food & Culinary</SelectItem>
            <SelectItem value="shopping">Shopping & Entertainment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Itinerary...
          </>
        ) : (
          "Generate Travel Itinerary"
        )}
      </Button>
    </form>
  )
}

