"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import WelcomeQuiz, { QuizData } from "@/components/welcomequiz"
import {
  Dumbbell,
  TrendingUp,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Send,
  Bot,
  Plus,
  User,
  ArrowLeft,
  Target,
  Activity,
  Clock,
} from "lucide-react"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Rest"]

const mealIdeas = [
  { id: 1, name: "Protein Pancakes", calories: 320, image: "/placeholder.svg?height=120&width=200" },
  { id: 2, name: "Chicken Bowl", calories: 450, image: "/placeholder.svg?height=120&width=200" },
  { id: 3, name: "Salmon & Veggies", calories: 380, image: "/placeholder.svg?height=120&width=200" },
  { id: 4, name: "Greek Yogurt Bowl", calories: 280, image: "/placeholder.svg?height=120&width=200" },
]


const ProfilePage = ({ userData, onBack }: { userData: QuizData; onBack: () => void }) => {
  const calculateAge = (birthday: string) => {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-sm text-gray-600">Your personal information</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{userData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Birthday:</span>
              <span className="font-medium">
                {userData.birthday ? new Date(userData.birthday).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{userData.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{userData.weight}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Fitness Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Primary Goal:</span>
              <span className="font-medium capitalize">{userData.fitnessGoal.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activity Level:</span>
              <span className="font-medium capitalize">{userData.activityLevel}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Workout Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 block mb-2">Preferred Days:</span>
              <div className="flex flex-wrap gap-2">
                {userData.workoutDays.map((day) => (
                  <Badge key={day} variant="secondary">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function FitnessApp() {
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // 0: Workouts, 1: Progress, 2: Meals
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [userData, setUserData] = useState<QuizData>({
    name: "Name",
    birthday: "",
    gender: "",
    height: 0,
    weight: 0,
    fitnessGoal: "",
    activityLevel: "",
    workoutDays: [],
  })
  const [question, setQuestion] = useState("")
  const [dailyCalories] = useState({ current: 1650, target: 2200 })
  const [macros] = useState({
    protein: { current: 120, target: 150 },
    carbs: { current: 180, target: 220 },
    fats: { current: 65, target: 80 },
  })

  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1 // Convert Sunday=0 to Saturday=6

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentPage < 2) {
      setCurrentPage(currentPage + 1)
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your AI API
    console.log("Question submitted:", question)
    setQuestion("")
  }

  useEffect(() => {
    // Always show the quiz - remove localStorage checks
    setIsQuizCompleted(false)
    setIsLoading(false)
  }, [])

  const WorkoutsPage = () => (
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

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Today's Workout: {muscleGroups[todayIndex]}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {todayIndex === 6 ? "Rest day - focus on recovery!" : "Ready to crush your workout?"}
          </p>
          <Button className="w-full">{todayIndex === 6 ? "View Recovery Tips" : "Start Workout"}</Button>
        </CardContent>
      </Card>
    </div>
  )

  const ProgressPage = () => (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to myFitness.ai, {userData.name}</h1>
        <p className="text-gray-600">How can I help you today?</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>

          <form onSubmit={handleSubmitQuestion} className="space-y-3">
            <Input
              placeholder="Ask me anything about fitness, nutrition, or workouts..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-gray-600">Days Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Dumbbell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">Workouts This Month</div>
          </CardContent>
        </Card>
      </div>

    </div>
  )

  const MealsPage = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <UtensilsCrossed className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">Nutrition</h1>
      </div>

      {/* Daily Calories Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold">{dailyCalories.current}</div>
            <div className="text-sm text-gray-600">of {dailyCalories.target} calories</div>
          </div>
          <Progress value={(dailyCalories.current / dailyCalories.target) * 100} className="h-3 mb-4" />

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm font-medium">Protein</div>
              <div className="text-xs text-gray-600">
                {macros.protein.current}g/{macros.protein.target}g
              </div>
              <Progress value={(macros.protein.current / macros.protein.target) * 100} className="h-1 mt-1" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">Carbs</div>
              <div className="text-xs text-gray-600">
                {macros.carbs.current}g/{macros.carbs.target}g
              </div>
              <Progress value={(macros.carbs.current / macros.carbs.target) * 100} className="h-1 mt-1" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">Fats</div>
              <div className="text-xs text-gray-600">
                {macros.fats.current}g/{macros.fats.target}g
              </div>
              <Progress value={(macros.fats.current / macros.fats.target) * 100} className="h-1 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={() => (window.location.href = "/food-search")}>
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
                <img
                  src={meal.image || "/placeholder.svg"}
                  alt={meal.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h4 className="font-medium text-sm">{meal.name}</h4>
                <p className="text-xs text-gray-600">{meal.calories} calories</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isQuizCompleted) {
    return (
      <WelcomeQuiz
        onComplete={(quizData) => {
          setUserData(quizData)
          setIsQuizCompleted(true)
          // Remove these localStorage calls:
          // localStorage.setItem("fitnessQuizCompleted", "true")
          // localStorage.setItem("fitnessUserData", JSON.stringify(quizData))
        }}
      />
    )
  }

  if (showProfile) {
    return <ProfilePage userData={userData} onBack={() => setShowProfile(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
            <User className="h-4 w-4" />
          </Button>

          <div className="flex space-x-2">
            {[0, 1, 2].map((page) => (
              <div
                key={page}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentPage === page ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
              disabled={currentPage === 2}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          <div className="w-full flex-shrink-0">
            <WorkoutsPage />
          </div>
          <div className="w-full flex-shrink-0">
            <ProgressPage />
          </div>
          <div className="w-full flex-shrink-0">
            <MealsPage />
          </div>
        </div>
      </div>
    </div>
  )
}
