"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Utensils } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size: string
  brand?: string
  image?: string
}


export default function MealSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [addedFoods, setAddedFoods] = useState<Set<string>>(new Set())
  const getNutritionInfo = async (query: string) => {
    try {
      const res = await fetch("/foodapi/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
  
      if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  
      const data = await res.json()
      console.log("API Nutrition Result:", data)
      return data
    } catch (err) {
      console.error("Failed to fetch nutrition info:", err)
      return null
    }
  }  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
  
    setIsLoading(true)
    setHasSearched(true)
  
    try {
      const customFoods: FoodItem[] = JSON.parse(localStorage.getItem("customFoods") || "[]")
      const matchingCustomFoods = customFoods.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      const apiData = await getNutritionInfo(searchQuery)
  
      // You may need to adapt this depending on your API's JSON shape
      const apiFoods: FoodItem[] = apiData.products.map((item: any, index: number) => ({
        id: item.code || `api-${index}`,
        name: item.product_name || "Unknown",
        calories: item.nutriments?.["energy_kcal_100g"] ?? (item.nutriments?.["energy_100g"] ? Math.round(item.nutriments["energy_100g"] * 0.239) :  0),
        protein: item.nutriments?.proteins_100g || 0,
        carbs: item.nutriments?.carbohydrates_100g || 0,
        fat: item.nutriments?.fat_100g || 0,
        serving_size: item.serving_size || "1 serving",
        brand: item.brands || "",
        image: item.image_front_url || "",
      }))
  
      setSearchResults([...matchingCustomFoods, ...apiFoods])
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }
  const router = useRouter()
  const addFood = (food: FoodItem) => {
    setAddedFoods((prev) => new Set([...prev, food.id]))

    // Store in localStorage for the main meals page
    const existingMeals = JSON.parse(localStorage.getItem("loggedMeals") || "[]")
    const newMeal = {
      ...food,
      timestamp: new Date().toISOString(),
      meal_type: "snack", // Default to snack, could be made selectable
    }
    localStorage.setItem("loggedMeals", JSON.stringify([...existingMeals, newMeal]))

    console.log("Added food to log:", food)
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(-45deg, #0a1a0a, #0f2f0f, #1a3d1a, #0a1a0a)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      {/* Dark Forest Floating particles */}
      <div className="particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              position: "absolute",
              width: "2px",
              height: "2px",
              borderRadius: "50%",
              background: i % 3 === 0 ? "#2d5a2d" : i % 3 === 1 ? "#1e4d1e" : "#0f3d0f",
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`,
              animation: "float 20s infinite linear",
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard?page=2">
            <Button variant="ghost" className="btn-press hover:bg-green-900/30" style={{ color: "#4ade80" }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1
              className="text-4xl font-black flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(74, 222, 128, 0.3)",
              }}
            >
              <Utensils className="h-8 w-8" style={{ color: "#4ade80" }} />
              LOG CALORIES
            </h1>
          </div>
        </div>

        <Card
          className="mb-8"
          style={{
            backgroundColor: "#0f2f0f",
            borderColor: "#22543d",
            border: "2px solid",
            boxShadow: "0 0 20px rgba(34, 84, 61, 0.3)",
          }}
        >
          <CardHeader style={{ borderColor: "#22543d" }}>
            <CardTitle className="flex items-center gap-2" style={{ color: "#86efac" }}>
              <Search className="h-5 w-5" style={{ color: "#4ade80" }} />
              Seach our Food Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search Open Food Facts (e.g., banana, salmon, almonds)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                style={{
                  backgroundColor: "#1a3d1a",
                  borderColor: "#22543d",
                  color: "#d1fae5",
                  border: "2px solid",
                }}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="btn-press"
                style={{
                  backgroundColor: "#16a34a",
                  color: "#f0fdf4",
                  boxShadow: "0 0 15px rgba(22, 163, 74, 0.4)",
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold" style={{ color: "#86efac" }}>
                Search Results {searchResults.length > 0 && `(${searchResults.length})`}
              </h2>
              <Button
                variant="outline"
                className="btn-press text-sm"
                style={{
                  borderColor: "#22c55e",
                  color: "#4ade80",
                  backgroundColor: "#0f2f0f",
                  border: "2px solid",
                }}
                onClick={() => router.push("/meals/create")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Food
              </Button>
            </div>
            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="animate-pulse"
                    style={{
                      backgroundColor: "#0f2f0f",
                      borderColor: "#22543d",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: "#1a3d1a" }}></div>
                      <div className="h-3 rounded w-1/2" style={{ backgroundColor: "#1a3d1a" }}></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((food) => (
                  <Card
                    key={food.id}
                    onClick={() => {
                      localStorage.setItem("selectedFood", JSON.stringify(food))
                      router.push(`/meals/${food.id}`)
                    }}
                    className="hover:scale-[1.01] transition-all duration-300"
                    style={{
                      backgroundColor: "#0f2f0f",
                      borderColor: "#22543d",
                      border: "2px solid",
                      boxShadow: "0 0 15px rgba(34, 84, 61, 0.2)",
                    }}
                  >
                    <CardContent className="p-6 flex justify-between items-start gap-4">
                      {/* Left: Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-green-100">{food.name}</h3>
                          {food.brand && (
                            <Badge style={{ backgroundColor: "#16a34a", color: "#f0fdf4", border: "1px solid #22c55e" }}>
                              {food.brand}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-green-300 mb-2">Serving size: {food.serving_size}</p>
                        <p className="text-sm text-green-300">Calories: {food.calories}</p>
                      </div>

                      {/* Right: Image + Button */}
                      <div className="w-32 flex flex-col items-center justify-start ml-auto">
                        {food.image && (
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-32 object-cover rounded shadow-md mb-2"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card
                style={{
                  backgroundColor: "#0f2f0f",
                  borderColor: "#22543d",
                }}
              >
                <CardContent className="p-8 text-center">
                  <div style={{ color: "#86efac" }}>
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2" style={{ color: "#d1fae5" }}>
                      No results found
                    </h3>
                    <p>Try searching for a different food or check your spelling.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card
            style={{
              backgroundColor: "#0f2f0f",
              borderColor: "#22543d",
            }}
          >
            <CardContent className="p-8 text-center">
              <div style={{ color: "#86efac" }}>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2" style={{ color: "#d1fae5" }}>
                  Log your favorite foods
                </h3>
                <p>Enter a food name above to discover it's nutrition information.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Add Forest Foods */}
        <Card
          className="mt-8"
          style={{
            backgroundColor: "#0f2f0f",
            borderColor: "#22543d",
            border: "2px solid",
          }}
        >
          <CardHeader style={{ borderColor: "#22543d" }}>
            <CardTitle style={{ color: "#86efac" }}>Your Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Banana", "Chicken Breast", "Greek Yogurt", "Avocado"].map((food) => (
                <Button
                  key={food}
                  variant="outline"
                  size="sm"
                  className="justify-start btn-press transition-all duration-200 bg-transparent"
                  onClick={() => {
                    setSearchQuery(food)
                    handleSearch()
                  }}
                  style={{
                    borderColor: "#22c55e",
                    color: "#4ade80",
                    backgroundColor: "transparent",
                    border: "2px solid",
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {food}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
