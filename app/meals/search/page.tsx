"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search } from "lucide-react"
import Link from "next/link"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size: string
  brand?: string
}

export default function MealSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/food-search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.foods || [])
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

  const addFood = (food: FoodItem) => {
    // Here you would typically add the food to the user's log
    console.log("Adding food to log:", food)
    // You could show a toast notification or update a globaxl state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Food</h1>
            <p className="text-gray-600">Find and log your meals</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Food Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search for food (e.g., apple, chicken breast, pizza)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h2>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((food) => (
                  <Card key={food.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{food.name}</h3>
                            {food.brand && <Badge variant="secondary">{food.brand}</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Serving size: {food.serving_size}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-orange-600">Calories</span>
                              <div className="text-lg font-bold">{food.calories}</div>
                            </div>
                            <div>
                              <span className="font-medium text-blue-600">Protein</span>
                              <div className="text-lg font-bold">{food.protein}g</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-600">Carbs</span>
                              <div className="text-lg font-bold">{food.carbs}g</div>
                            </div>
                            <div>
                              <span className="font-medium text-purple-600">Fat</span>
                              <div className="text-lg font-bold">{food.fat}g</div>
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => addFood(food)} className="ml-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p>Try searching for a different food item or check your spelling.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start your search</h3>
                <p>Enter a food name above to find nutritional information and add it to your log.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
