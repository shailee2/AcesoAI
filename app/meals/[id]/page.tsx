"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function FoodDetailPage() {
  const [food, setFood] = useState<FoodItem | null>(null)
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [loggedMeals, setLoggedMeals] = useState<FoodItem[]>([])
  const router = useRouter()
  const [unit, setUnit] = useState("serving")
  const unitMultipliers: Record<string, number> = {
    serving: 100,
    g: 1,
    oz: 28.35,
    ml: 1,
    cup: 250,
  }

  

  useEffect(() => {
    const data = localStorage.getItem("selectedFood")
    if (data) {
      const parsed = JSON.parse(data)
      setFood(parsed)
  
      const match = parsed.serving_size?.match(/^([\d.]+)\s*(\w+)?/)
      if (match) {
        const [, quantity, unit] = match
        setServingMultiplier(Number(quantity))
        setUnit(unit || "serving")
      } else {
        setServingMultiplier(1)
        setUnit("serving")
      }
    }
  }, [])
  

  const logFood = () => {
    if (!food) return
  
    const grams = servingMultiplier * (unitMultipliers[unit] || 1)
  
    const adjustedCalories = Math.round((food.calories ?? 0) * (grams / 100))
    const adjustedProtein = Math.round((food.protein ?? 0) * (grams / 100) * 10) / 10
    const adjustedCarbs = Math.round((food.carbs ?? 0) * (grams / 100) * 10) / 10
    const adjustedFat = Math.round((food.fat ?? 0) * (grams / 100) * 10) / 10
  
    const existing = JSON.parse(localStorage.getItem("loggedMeals") || "[]")
  
    const newMeal = {
      ...food,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      multiplier: servingMultiplier,
      unit: unit,
      timestamp: new Date().toISOString(),
      meal_type: "snack",
    }
  
    localStorage.setItem("loggedMeals", JSON.stringify([...existing, newMeal]))
    router.push("/dashboard?page=2")
  }
  

  if (!food) return <p className="text-center text-green-300">Loading food details...</p>

  return (
    <div className="max-w-2xl mx-auto p-6 text-green-100">
      {food.image && (
        <img src={food.image} alt={food.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      )}

      <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
      {food.brand && <p className="text-sm mb-2">Brand: {food.brand}</p>}
      <p>Serving size: {food.serving_size}</p>

      <div className="my-4 flex items-center gap-2">
        <label className="text-green-300">Serving:</label>
        
        <Input
            type="number"
            min={0.1}
            step={0.1}
            defaultValue={1}
            value={servingMultiplier}
            onChange={(e) => setServingMultiplier(Number(e.target.value))}
            className="w-24 text-black"
        />

        <select
            value={unit}
            onChange={(e) => {
                const selectedUnit = e.target.value
                setUnit(selectedUnit)
                setServingMultiplier(unitMultipliers[selectedUnit] || 1)
            }}
            className="text-white border border-green-500 px-2 py-1 rounded"
        >
            {["serving", "g", "oz", "ml", "cup"].map((u) => (
            <option key={u} value={u}>
                {u}
            </option>
            ))}
        </select>
        </div>



      <div className="space-y-1 mb-6 text-green-200">
      {food && (
        <>
            <p>Calories: {Math.round((food.calories ?? 0) * (servingMultiplier * unitMultipliers[unit]) / 100)}</p>
            <p>Protein: {Math.round(((food.protein ?? 0) * (servingMultiplier * unitMultipliers[unit]) / 100 * 10) / 10)}g</p>
            <p>Carbs: {Math.round(((food.carbs ?? 0) * (servingMultiplier * unitMultipliers[unit]) / 100 * 10) / 10)}g</p>
            <p>Fat: {Math.round(((food.fat ?? 0) * (servingMultiplier * unitMultipliers[unit]) / 100 * 10) / 10)}g</p>

        </>
        )}

      </div>

      <Button
        className="mt-4"
        style={{ backgroundColor: "#16a34a", color: "#f0fdf4" }}
        onClick={
          logFood
        }
      >
        Log This Food
      </Button>
    </div>
  )
}
