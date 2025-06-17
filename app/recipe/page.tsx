"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

const recipes = {
  1: {
    name: "Protein Pancakes",
    image: "/placeholder.svg?height=300&width=400",
    calories: 320,
    protein: 28,
    carbs: 35,
    fat: 8,
    servings: 2,
    prepTime: "10 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    ingredients: [
      "1 cup oats",
      "1 scoop protein powder",
      "2 eggs",
      "1/2 cup milk",
      "1 banana",
      "1 tsp baking powder",
      "Pinch of salt",
      "Berries for topping",
    ],
    instructions: [
      "Blend oats into flour consistency",
      "Mix all dry ingredients in a bowl",
      "Whisk eggs and milk together",
      "Combine wet and dry ingredients",
      "Mash banana and fold into batter",
      "Heat pan over medium heat",
      "Pour batter to form pancakes",
      "Cook 2-3 minutes each side",
      "Serve with berries on top",
    ],
  },
  2: {
    name: "Chicken Bowl",
    image: "/placeholder.svg?height=300&width=400",
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 15,
    servings: 1,
    prepTime: "15 mins",
    cookTime: "20 mins",
    difficulty: "Medium",
    ingredients: [
      "150g chicken breast",
      "1/2 cup brown rice",
      "1 cup broccoli",
      "1/2 avocado",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Garlic powder",
      "Lemon juice",
    ],
    instructions: [
      "Cook brown rice according to package",
      "Season chicken with salt, pepper, garlic",
      "Heat oil in pan over medium-high heat",
      "Cook chicken 6-7 minutes each side",
      "Steam broccoli until tender",
      "Slice avocado",
      "Assemble bowl with rice as base",
      "Add chicken, broccoli, and avocado",
      "Drizzle with lemon juice",
    ],
  },
}

export default function RecipeDetail() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.id as string
  const recipe = recipes[recipeId as keyof typeof recipes]

  if (!recipe) {
    return <div>Recipe not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{recipe.name}</h1>
            <p className="text-sm text-gray-600">Recipe Details</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-0">
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{recipe.prepTime} prep</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{recipe.cookTime} cook</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <Badge variant="secondary" className="mb-4">
                {recipe.difficulty}
              </Badge>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{recipe.calories}</div>
                  <div className="text-xs text-gray-500">calories</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{recipe.protein}g</div>
                  <div className="text-xs text-gray-500">protein</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{recipe.carbs}g</div>
                  <div className="text-xs text-gray-500">carbs</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{recipe.fat}g</div>
                  <div className="text-xs text-gray-500">fat</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-sm">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg">
          Add to Meal Plan
        </Button>
      </div>
    </div>
  )
}