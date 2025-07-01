"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CreateFoodPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    serving_size: "",
    brand: "",
    image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const newFood = {
      ...form,
      id: `custom-${Date.now()}`,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    }

    const existing = JSON.parse(localStorage.getItem("customFoods") || "[]")
    localStorage.setItem("customFoods", JSON.stringify([newFood, ...existing]))
    router.push("/meals/search")
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-300">Create a Food Item</h1>
      {["name", "calories", "protein", "carbs", "fat", "serving_size", "brand", "image"].map((field) => (
        <Input
          key={field}
          name={field}
          placeholder={field.replace("_", " ")}
          value={(form as any)[field]}
          onChange={handleChange}
          className="mb-2"
        />
      ))}
      <Button onClick={handleSave} className="bg-green-700 text-white mt-2">Save</Button>
    </div>
  )
}
