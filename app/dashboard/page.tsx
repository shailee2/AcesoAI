"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, TrendingUp, UtensilsCrossed, ChevronLeft, ChevronRight, Send, Bot, Plus, User, Clock, Target } from "lucide-react"
import WelcomeQuiz, { QuizData } from "@/components/welcomequiz"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { marked } from "marked"



const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Rest"]
const mealIdeas = [
  { id: 1, name: "Protein Pancakes", calories: 320, image: "https://via.placeholder.com/200x120" },
  { id: 2, name: "Chicken Bowl", calories: 450, image: "https://via.placeholder.com/200x120" },
  { id: 3, name: "Salmon & Veggies", calories: 380, image: "https://via.placeholder.com/200x120" },
  { id: 4, name: "Greek Yogurt Bowl", calories: 280, image: "https://via.placeholder.com/200x120" },
]

export default function DashboardPage() {
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const initialPage = Number(searchParams.get("page")) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [todayIndex, setTodayIndex] = useState<number | null>(null)
  const [userData, setUserData] = useState<QuizData>({
    name: "Name",
    birthday: "",
    gender: "",
    height: 0,
    weight: 0,
    fitnessGoal: "",
    activityLevel: ""
  })
  useEffect(() => {
    const today = new Date().getDay()
    setTodayIndex(today === 0 ? 6 : today - 1)
  }, [])
  function getAge(birthday: string): number {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  
  // Calculating Macros
  const total_cals = (() => {
    const age = getAge(userData.birthday)
    const weight = Number(userData.weight)
    const height = Number(userData.height)
    const gender = userData.gender
    if (!age || !weight || !height || !gender) return 2000
    let bmr = 0
    if (gender === "female") {
      bmr = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
    } 
    else {
      bmr = 66 + (6.23 * weight) + (12.7 * height) - (6.76 * age)
    }
    const multiplierMap: Record<string, number> = {
      "1": 1.2,
      "2": 1.375,
      "3": 1.55,
      "4": 1.725,
      "5": 1.9,
    }
    const multiplier = multiplierMap[userData.activityLevel] ?? 1.55
    let tdee = bmr * multiplier
    switch (userData.fitnessGoal) {
      case "lose_weight":
        tdee -= 500
        break
      case "gain_muscle":
        tdee += 500
        break
      case "get_fit":
        tdee -= 100
        break
    }
    return Math.round(tdee)
  })()
  let pr = 0.3
  let cr = 0.4
  let fr = 0.3
  switch (userData.fitnessGoal) {
    case "lose_weight":
      pr = .40
      cr = .30
      fr = .30
      break
    case "gain_muscle":
      pr = .30
      cr = .45
      fr = .25
      break
    case "get_fit":
      pr = .35
      cr = .35
      fr = .30
      break
    case "maintain":
      pr = 0.3
      cr = 0.4
      fr = 0.3
      break
  }
  
  const total_protein = Math.round(pr * total_cals / 4)
  const total_fats = Math.round(fr * total_cals / 9)
  const total_carbs = Math.round(cr * total_cals / 4)
  //Current macros -- will have to change with calorie tracking.
  const curr_cals = 100
  const curr_carbs = 100
  const curr_protein = 100
  const curr_fats = 30
  
  const askAI = async (prompt: string) => {
    const age = getAge(userData.birthday)
    const { weight, height, gender, fitnessGoal, activityLevel} = userData
    const modified_prompt = `You are a helpful fitness assistant. Keep in mind that I am ${age} years old, ${weight} pounds, ${height} inches, ${gender}, and my fitness goal is ${fitnessGoal}. My activity level is ${activityLevel}. Now answer this: ${prompt}. Try to answer as concisely and clearly as possible. And don't repeat the data I gave you about myself.`
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: modified_prompt })
    })
    const data = await res.json()
    return data.result
  }  

  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const formatted = marked(response)
  const handleAsk = async (e: React.FormEvent) => {
  e.preventDefault() // prevent page reload
  const res = await askAI(input)
  setResponse(res)
}


  

  useEffect(() => {
    const completed = localStorage.getItem("fitnessQuizCompleted") === "true"
    const storedData = localStorage.getItem("fitnessUserData")
    if (completed && storedData) {
      setUserData(JSON.parse(storedData))
      setIsQuizCompleted(true)
    }
    setIsLoading(false)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    const distance = touchStart - touchEnd
    if (distance > 50 && currentPage < 2) setCurrentPage(currentPage + 1)
    if (distance < -50 && currentPage > 0) setCurrentPage(currentPage - 1)
  }

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!isQuizCompleted) return <WelcomeQuiz onComplete={(quizData) => {
    setUserData(quizData)
    setIsQuizCompleted(true)
    localStorage.setItem("fitnessQuizCompleted", "true")
    localStorage.setItem("fitnessUserData", JSON.stringify(quizData))
  }} />



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
      <Link href="/profile">
        <User className="h-5 w-5 text-gray-600 hover:text-black cursor-pointer" />
      </Link>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === currentPage ? "bg-blue-600" : "bg-gray-300"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.min(2, currentPage + 1))} disabled={currentPage === 2}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
  {/* WORKOUTS PAGE */}
      <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
          <div className="w-full flex-shrink-0 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><Dumbbell className="h-5 w-5" /> Workouts</h2>
            {/* TODAYS WORKOUT CARD */}
            <Card className="mb-4 border border-black bg-blue-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Today's Workout</h3>
                  {todayIndex !== null && (
                    <span className="text-sm text-blue-600 font-medium">
                      {muscleGroups[todayIndex]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {todayIndex === 6 ? "Rest day – focus on recovery!" : "Ready to crush your workout?"}
                </p>
                <Button className="w-full">
                  {todayIndex === 6 ? "View Recovery Tips" : "Start Workout"}
                </Button>
              </CardContent>
            </Card>
            {/* CALENDAR PART */}
            <div className="space-y-3 mb-4">
            {todayIndex !== null && daysOfWeek.map((day, i) => (
                <Card key={day} className={`cursor-pointer ${i === todayIndex ? "bg-blue-100 ring-2 ring-blue-500" : ""}`}>
                  <CardContent className="p-2 flex items-center justify-between text-sm">
                  <div className="font-medium">{day}</div>
                  <div className="text-xs text-gray-500 text-right">
                    {muscleGroups[i]}
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
          </div>
  {/* PROGRESS PAGE */}
          <div className="w-full flex-shrink-0 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><Bot className="h-5 w-5" /> Progress</h2>
            {/* AI ASSISTANT PART */}
            <Card className="mb-4">
              <CardContent className="p-4">
              <form className="space-y-2" onSubmit={handleAsk}>
                <Input placeholder="Ask AI about fitness..." onChange={(e) => setInput(e.target.value)} />
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" /> Ask AI
                </Button>
                {response && (
                  <div
                    className="prose prose-sm max-w-none prose-p:mb-4"
                    dangerouslySetInnerHTML={{ __html: marked(response) }}
                  />
                )}
              </form>
              </CardContent>
            </Card>
          {/* TRENDS PART */}
            <div className="grid grid-cols-2 gap-4">
              <Card><CardContent className="text-center"><TrendingUp className="h-6 w-6 mx-auto" /><div>7-Day Streak</div></CardContent></Card>
              <Card><CardContent className="text-center"><Dumbbell className="h-6 w-6 mx-auto" /><div>12 Workouts this Month</div></CardContent></Card>
            </div>
          </div>
  {/* MEALS PAGE */}
          <div className="w-full flex-shrink-0 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><UtensilsCrossed className="h-5 w-5" /> Meals</h2>
            {/* CALORIE TRACKER */}
            <Card className="mb-4">
              <CardContent className="text-center">
                <div className="flex justify-between items-baseline text-sm text-gray-600 mb-2">
                  <div className="text-2xl font-bold text-black">{curr_cals} calories</div>
                  <div>out of {total_cals} calories</div>
                </div>
                <Progress value={(curr_cals / total_cals) * 100} className="h-3" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Carbs</div>
                    <Progress value={curr_carbs / total_carbs * 100} className="h-2" />
                    <div className="text-xs text-gray-600 mt-1">{curr_carbs}g out of {total_carbs}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Protein</div>
                    <Progress value={curr_protein / total_protein * 100} className="h-2" />
                    <div className="text-xs text-gray-600 mt-1">{curr_protein}g out of {total_protein}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Fat</div>
                    <Progress value={curr_fats / total_fats * 100} className="h-2" />
                    <div className="text-xs text-gray-600 mt-1">{curr_fats}g out of {total_fats}g</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button size="lg" className="w-full mb-4">
            <Link href="/meals/search" className="w-full h-full flex items-center justify-center">
                Log Calories
              </Link>
            </Button>
            {/* MEAL TRACKER */}
            <div className="space-y-3 mb-4">
              {/* BREAKFAST CARD */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-semibold text-gray-800">Breakfast</div>
                    <div className="col-span-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Oatmeal with berries</span>
                        <span className="text-gray-600">320 cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Greek yogurt</span>
                        <span className="text-gray-600">150 cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Coffee with milk</span>
                        <span className="text-gray-600">45 cal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* LUNCH CARD */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-semibold text-gray-800">Lunch</div>
                    <div className="col-span-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Grilled chicken salad</span>
                        <span className="text-gray-600">380 cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Whole grain roll</span>
                        <span className="text-gray-600">120 cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Apple</span>
                        <span className="text-gray-600">95 cal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* DINNER CARD */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-semibold text-gray-800">Dinner</div>
                    <div className="col-span-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Salmon fillet</span>
                        <span className="text-gray-600">280 cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Roasted vegetables</span>
                        <span className="text-gray-600">110 cal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Brown rice</span>
                        <span className="text-gray-600">150 cal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* SNACK CARD */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-semibold text-gray-800">Snack</div>
                    <div className="col-span-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Mixed nuts</span>
                        <span className="text-gray-600">190 cal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Meal Ideas</h3>
              <div className="flex gap-4 overflow-x-auto">
                {mealIdeas.map((m) => (
                  <Card key={m.id} className="w-40 flex-shrink-0">
                    <CardContent className="p-2">
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.calories} cal</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
