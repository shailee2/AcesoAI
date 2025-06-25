"use client"

import { Dumbbell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Rest"]

const today = new Date().getDay()
const todayIndex = today === 0 ? 6 : today - 1

export default function WorkoutsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Workouts</h1>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => (
          <Card
            key={day}
            className={`cursor-pointer transition-all hover:shadow-md ${
              index === todayIndex ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => (window.location.href = `/workout/${day.toLowerCase()}`)}
          >
            <CardContent className="p-3 text-center">
              <div className="text-sm font-medium mb-1">{day}</div>
              <div className="text-xs text-gray-600">{muscleGroups[index]}</div>
              {index === todayIndex && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Today
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
