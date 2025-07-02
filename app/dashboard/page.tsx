"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dumbbell,
  TrendingUp,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Send,
  Zap,
  Play,
  Plus,
  BarChart3,
} from "lucide-react"
import WelcomeQuiz, { QuizData } from "@/components/welcomequiz"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { marked } from "marked"
import { Settings } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"



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


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Rest"]
const mealIdeas = [
  { id: 1, name: "Protein Pancakes", calories: 320, image: "https://via.placeholder.com/200x120" },
  { id: 2, name: "Chicken Bowl", calories: 450, image: "https://via.placeholder.com/200x120" },
  { id: 3, name: "Salmon & Veggies", calories: 380, image: "https://via.placeholder.com/200x120" },
  { id: 4, name: "Greek Yogurt Bowl", calories: 280, image: "https://via.placeholder.com/200x120" },
]

const FloatingParticles = ({ pageType }: { pageType: "workout" | "progress" | "nutrition" }) => {
  const particles = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      className={`particle ${pageType}`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${20 + Math.random() * 10}s`,
      }}
    />
  ))
  return <div className="particles">{particles}</div>
}

export default function DashboardPage() {
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const initialPage = searchParams.get("page") !== null ? Number(searchParams.get("page")) : 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [todayIndex, setTodayIndex] = useState<number | null>(null)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [loggedMeals, setLoggedMeals] = useState<FoodItem[]>([])
  const [curr_cals, setCurrCals] = useState(0)
  const [curr_carbs, setCurrCarbs] = useState(0)
  const [curr_protein, setCurrProtein] = useState(0)
  const [curr_fats, setCurrFats] = useState(0)

  const deleteMeal = (indexToDelete: number) => {
    const updatedMeals = loggedMeals.filter((_, index) => index !== indexToDelete)
    setLoggedMeals(updatedMeals)
    localStorage.setItem("loggedMeals", JSON.stringify(updatedMeals))
  }  
  const router = useRouter()
  const [userData, setUserData] = useState<QuizData>({
    name: "Name",
    birthday: "",
    gender: "",
    height: 0,
    weight: 0,
    fitnessGoal: "",
    activityLevel: ""
  })
  const pageConfigs = {
    0: { type: "workout", bgClass: "workout-bg", fabClass: "workout-fab" },
    1: { type: "progress", bgClass: "progress-bg", fabClass: "progress-fab" },
    2: { type: "nutrition", bgClass: "nutrition-bg", fabClass: "nutrition-fab" },
  }

  useEffect(() => {
    const stored = localStorage.getItem("loggedMeals")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLoggedMeals(parsed)
      } catch (e) {
        console.error("Error parsing logged meals:", e)
      }
    }
  }, [])

  useEffect(() => {
    const today = new Date().toDateString() // e.g., "Tue Jul 2 2025"
    const lastReset = localStorage.getItem("lastResetDate")
  
    if (lastReset !== today) {
      // Clear meals and reset macros
      localStorage.removeItem("loggedMeals")
      setLoggedMeals([])
      setCurrCals(0)
      setCurrCarbs(0)
      setCurrProtein(0)
      setCurrFats(0)
  
      // Update the last reset date
      localStorage.setItem("lastResetDate", today)
    }
  }, [])
  

  const currentPageConfig = pageConfigs[currentPage as keyof typeof pageConfigs]
  useEffect(() => {
    const today = new Date().getDay()
    setTodayIndex(today === 0 ? 6 : today - 1)

    // Workout timer
    let timerInterval: NodeJS.Timeout
    if (isWorkoutActive) {
      timerInterval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [isWorkoutActive])
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
  //MACROS
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
//MACRO TRACKING
  useEffect(() => {
    const stored = localStorage.getItem("loggedMeals")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLoggedMeals(parsed)

        const totals = parsed.reduce(
          (acc: { cals: number; carbs: number; protein: number; fats: number }, meal: any) => {
            acc.cals += meal.calories || 0
            acc.carbs += meal.carbs || 0
            acc.protein += meal.protein || 0
            acc.fats += meal.fat || 0
            return acc
          },
          { cals: 0, carbs: 0, protein: 0, fats: 0 }
        )

        setCurrCals(Math.round(totals.cals))
        setCurrCarbs(Math.round(totals.carbs))
        setCurrProtein(Math.round(totals.protein))
        setCurrFats(Math.round(totals.fats))
      } catch (e) {
        console.error("Error parsing logged meals:", e)
      }
    }
  }, [])


  
  const askAI = async (prompt: string) => {
    const age = getAge(userData.birthday)
    const { weight, height, gender, fitnessGoal, activityLevel} = userData
    const modified_prompt = `You are a helpful fitness assistant. Keep in mind that I am ${age} years old, ${weight} pounds, ${height} inches, ${gender}, and my fitness goal is ${fitnessGoal}. My activity level is ${activityLevel}. Now answer this: ${prompt}. Try to answer as concisely and clearly as possible. And don't repeat the data I gave you about myself.`
    const res = await fetch("/chatapi/ask", {
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
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
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
    
  <div className={`min-h-screen ${currentPageConfig.bgClass} relative`}>
      <FloatingParticles pageType={currentPageConfig.type as "workout" | "progress" | "nutrition"} />

      {/* Header */}
      <div
        className="backdrop-blur-md shadow-2xl border-b p-4 flex justify-between items-center relative z-10"
        style={{ backgroundColor: "rgba(28, 28, 28, 0.8)", borderColor: "#333333" }}
      >
        {/* AcesoAI Brand */}
        <div className="text-lg font-bold tracking-wide text-[#ededed] flex items-center gap-2">
          AcesoAI
        </div>

        {/* Arrows Centered */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="btn-press"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
            disabled={currentPage === 2}
            className="btn-press"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Settings Dropdown */}
        <Dropdown>
          <Dropdown.Trigger>
            <div onClick={() => setDropdownOpen((prev) => !prev)} className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-5 w-5 transition-colors" style={{ color: "#aaaaaa" }} />
            </div>
          </Dropdown.Trigger>
          {dropdownOpen && (
            <Dropdown.Content
              className="fixed top-12 right-4 z-50 w-48 shadow-lg border rounded-md p-2"
              style={{ backgroundColor: "#1c1c1c", borderColor: "#333333" }}
            >
              <Dropdown.Item onClick={() => router.push("/profile")}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => console.log("Log out")}>Logout</Dropdown.Item>
            </Dropdown.Content>
          )}
        </Dropdown>
      </div>

      <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
  {/* WORKOUTS PAGE - Red/Orange Theme */}
          <div className="w-full flex-shrink-0 p-6 relative z-10 workout-page">
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-black mb-2 workout-text">
                <Dumbbell className="h-8 w-8" style={{ color: "#ff3c38" }} />
                WORKOUTS
              </h1>
              <p style={{ color: "#aaaaaa" }} className="text-lg">
                Motivate Yourself
              </p>
            </div>

            <Button
              size="lg"
              className="w-full mb-8 btn-press"
              onClick={() => setIsWorkoutActive(!isWorkoutActive)}
              style={{ backgroundColor: "#541810" }}
            >
              <Play className="h-5 w-5 mr-2" />
              {isWorkoutActive ? "PAUSE WORKOUT" : "START WORKOUT"}
            </Button>

            {/* Today's Challenge */}
            <Card style={{ borderColor: "#ff3c38" }} className="border-2 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: "#ff3c38" }}></div>
                  <h3 className="text-xl font-bold" style={{ color: "#ededed" }}>
                    TODAY'S WORKOUT
                  </h3>
                  <div
                    className="ml-auto text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#ff3c38", color: "#ededed" }}
                  >
                    LIVE
                  </div>
                </div>
                <p style={{ color: "#aaaaaa" }} className="mb-6">
                  Push beyond limits. Become unstoppable.
                </p>

                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between p-4 rounded-xl relative overflow-hidden"
                    style={{ backgroundColor: "rgba(170, 170, 170, 0.1)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: "#ff3c38" }}
                      >
                      </div>
                      <div>
                        <p style={{ color: "#ededed" }} className="font-semibold">
                          LEGS
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: "#ededed" }} className="font-bold text-lg">
                        45/50
                      </p>
                      <p style={{ color: "#ff8c42" }} className="text-sm font-bold">
                        90% COMPLETE
                      </p>
                      <Progress value={90} variant="workout" className="w-24 mt-1" />
                    </div>
                  </div>

                  <Button className="w-full btn-press" style={{ backgroundColor: "#ff8c42" }}>
                    <Plus className="h-4 w-4 mr-2" />
                    ADD CHALLENGE
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4 mb-8">

              <Card className="stat-card workout-card">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p style={{ color: "#aaaaaa" }} className="text-sm font-medium mb-1">
                      MONDAY
                    </p>
                    <p className="text-4xl font-black counter" style={{ color: "#ff6b47" }}>
                      LEGS
                    </p>
                  </div>
                  <div className="relative">
                    <Zap className="h-8 w-8" style={{ color: "#ff6b47" }} />
                  </div>
                </CardContent>
              </Card>
              <Card className="stat-card workout-card">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p style={{ color: "#aaaaaa" }} className="text-sm font-medium mb-1">
                      TUESDAY
                    </p>
                    <p className="text-4xl font-black counter" style={{ color: "#ff6b47" }}>
                      SHOULDERS/ABS
                    </p>
                  </div>
                  <div className="relative">
                    <Zap className="h-8 w-8" style={{ color: "#ff6b47" }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
  {/* PROGRESS PAGE */}
          <div className="w-full flex-shrink-0 p-6 relative z-10 progress-page">
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-black mb-2 progress-text">
              <BarChart3 className="h-8 w-8" style={{ color: "#3b82f6" }} />
              PROGRESS
              </h1>
            </div>
            {/* AI ASSISTANT PART */}
            <Card className="mb-6 stat-card progress-card">
              <CardContent className="p-6">
                <form className="space-y-4" onSubmit={handleAsk}>
                  <Input placeholder="Ask AI about fitness..." onChange={(e) => setInput(e.target.value)} />
                  <Button type="submit" className="w-full btn-press" style={{ backgroundColor: "#103c73" }}>
                    <Send className="h-4 w-4 mr-2" /> Ask AI
                  </Button>
                  {response && (
                    <div className="mt-6 p-4 rounded-xl stat-card">
                      <div
                        className="prose prose-sm max-w-none"
                        style={{ color: "#ededed" }}
                        dangerouslySetInnerHTML={{ __html: marked(response) }}
                      />
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="stat-card progress-card">
                <CardContent className="text-center p-6">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3" style={{ color: "#6366f1" }} />
                  <div className="text-3xl font-black mb-1 counter" style={{ color: "#6366f1" }}>
                    7
                  </div>
                  <div className="text-sm" style={{ color: "#aaaaaa" }}>
                    Day Streak
                  </div>
                  <div className="mt-2">
                    <Progress value={70} variant="progress" />
                  </div>
                </CardContent>
              </Card>
              <Card className="stat-card progress-card">
                <CardContent className="text-center p-6">
                  <Dumbbell className="h-10 w-10 mx-auto mb-3" style={{ color: "#8b5cf6" }} />
                  <div className="text-3xl font-black mb-1 counter" style={{ color: "#8b5cf6" }}>
                    12
                  </div>
                  <div className="text-sm" style={{ color: "#aaaaaa" }}>
                    This Month
                  </div>
                  <div className="mt-2">
                    <Progress value={40} variant="progress" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
  {/* MEALS PAGE */}
          {/* NUTRITION PAGE */}
          <div className="w-full flex-shrink-0 p-6 relative z-10 nutrition-page">
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-black mb-2 nutrition-text">
                <UtensilsCrossed className="h-8 w-8" style={{ color: "#21d375" }} />
                MEALS
              </h1>
            </div>

            <Card className="mb-6 stat-card nutrition-card">
              <CardContent className="p-6 text-center">
                <div className="flex justify-between items-baseline mb-4">
                  <div className="text-5xl font-black counter" style={{ color: "#21d375" }}>
                    {curr_cals.toLocaleString()}
                  </div>
                  <div style={{ color: "#aaaaaa" }} className="text-lg">
                    / {total_cals.toLocaleString()} calories
                  </div>
                </div>
                <Progress value={(curr_cals / total_cals) * 100} variant="nutrition" className="h-4 mb-6" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div style={{ color: "#aaaaaa" }} className="text-xs mb-2 font-bold">
                      CARBS
                    </div>
                    <Progress value={(curr_carbs / total_carbs) * 100} variant="nutrition" className="h-2 mb-2" />
                    <div style={{ color: "#ededed" }} className="text-sm font-bold">
                      {curr_carbs}g / {total_carbs}g
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: "#aaaaaa" }} className="text-xs mb-2 font-bold">
                      PROTEIN
                    </div>
                    <Progress value={(curr_protein / total_protein) * 100} variant="nutrition" className="h-2 mb-2" />
                    <div style={{ color: "#ededed" }} className="text-sm font-bold">
                      {curr_protein}g / {total_protein}g
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: "#aaaaaa" }} className="text-xs mb-2 font-bold">
                      FAT
                    </div>
                    <Progress value={(curr_fats / total_fats) * 100} variant="nutrition" className="h-2 mb-2" />
                    <div style={{ color: "#ededed" }} className="text-sm font-bold">
                      {curr_fats}g / {total_fats}g
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full mb-6 btn-press" style={{ backgroundColor: "#255235" }}>
              <Link href="/meals" className="w-full h-full flex items-center justify-center">
                LOG CALORIES
              </Link>
            </Button>

            <div className="space-y-4 mb-8">
              <Card className="stat-card nutrition-card">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-green-400">Logged Meals</h2>
                  </div>
                  {loggedMeals.length === 0 ? (
                    <p className="text-white text-center">No meals logged yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {loggedMeals.map((meal, index) => (
                        <li key={index} className="p-3 rounded border border-green-700">
                          <p className="text-white text-base font-semibold mb-1">{meal.name}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-green-400 text-sm">{meal.calories} calories</p>
                            <button onClick={() => deleteMeal(index)} className="text-red-800 hover:text-red-200">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className={`fab ${currentPageConfig.fabClass} flex items-center justify-center`}>
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  )
} 
