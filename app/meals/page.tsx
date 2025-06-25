"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UtensilsCrossed } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function MealsPage() {
  const [dailyCalories] = useState({ current: 1650, target: 2200 })
  const [macros] = useState({
    protein: { current: 120, target: 150 },
    carbs: { current: 180, target: 220 },
    fats: { current: 65, target: 80 },
  })

  const mealIdeas = [
    { id: 1, name: "Protein Pancakes", calories: 320},
    { id: 2, name: "Chicken Bowl", calories: 450},
    { id: 3, name: "Salmon & Veggies", calories: 380 },
    { id: 4, name: "Greek Yogurt Bowl", calories: 280 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <UtensilsCrossed className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">Nutrition</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold">{dailyCalories.current}</div>
            <div className="text-sm text-gray-600">of {dailyCalories.target} calories</div>
          </div>
          <Progress value={(dailyCalories.current / dailyCalories.target) * 100} className="h-3 mb-4" />

          <div className="grid grid-cols-3 gap-4">
            {["protein", "carbs", "fats"].map((macro) => (
              <div className="text-center" key={macro}>
                <div className="text-sm font-medium">{macro[0].toUpperCase() + macro.slice(1)}</div>
                <div className="text-xs text-gray-600">
                  {macros[macro as keyof typeof macros].current}/{macros[macro as keyof typeof macros].target}g
                </div>
                <Progress
                  value={(macros[macro as keyof typeof macros].current / macros[macro as keyof typeof macros].target) * 100}
                  className="h-1 mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={() => (window.location.href = "/meals/search")}>
        <Plus className="h-4 w-4 mr-2" />
        Log Calories
      </Button>

      {/* Meal Sections */}
      <div className="grid grid-cols-2 gap-4">
        {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => (
          <Card key={meal}>
            <CardContent className="p-3">
              <h4 className="font-medium text-sm mb-2">{meal}</h4>
              <div className="text-xs text-gray-600">No items logged</div>
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                Add {meal}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal Ideas */}
      <div>
        <h3 className="font-semibold mb-3">Meal Ideas</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {mealIdeas.map((meal) => (
            <Card
              key={meal.id}
              className="flex-shrink-0 w-48 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => (window.location.href = `/recipe/${meal.id}`)}
            >
              <CardContent className="p-3">
                <h4 className="font-medium text-sm">{meal.name}</h4>
                <p className="text-xs text-gray-600">{meal.calories} calories</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
