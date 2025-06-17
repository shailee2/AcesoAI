"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const foodDatabase = [
  { id: 1, name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
  { id: 2, name: "Brown Rice", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving: "100g" },
  { id: 3, name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: "100g" },
  { id: 4, name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 12, serving: "100g" },
  { id: 5, name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: "100g" },
  { id: 6, name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: "100g" },
  { id: 7, name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, serving: "100g" },
  { id: 8, name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: "100g" },
]

export default function FoodSearch() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFoods, setFilteredFoods] = useState(foodDatabase)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = foodDatabase.filter((food) => food.name.toLowerCase().includes(term.toLowerCase()))
    setFilteredFoods(filtered)
  }

  const addFood = (food: (typeof foodDatabase)[0]) => {
    // Here you would add the food to the user's log
    console.log("Adding food:", food)
    // You could show a success message or redirect back
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Food Database</h1>
            <p className="text-sm text-gray-600">Search and log your meals</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for foods..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredFoods.map((food) => (
            <Card key={food.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{food.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Per {food.serving}</p>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{food.calories}</div>
                        <div className="text-gray-500">cal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{food.protein}g</div>
                        <div className="text-gray-500">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{food.carbs}g</div>
                        <div className="text-gray-500">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{food.fat}g</div>
                        <div className="text-gray-500">fat</div>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" onClick={() => addFood(food)} className="ml-4">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No foods found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}