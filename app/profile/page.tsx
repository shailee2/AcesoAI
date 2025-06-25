"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Target, User } from "lucide-react"
import { useRouter } from "next/navigation"

type QuizData = {
  name: string
  birthday: string
  gender: string
  height: number
  weight: number
  fitnessGoal: string
  activityLevel: string
}
const activityLevelMap: Record<string, string> = {
    "1": "Sedentary",
    "2": "Lightly Active",
    "3": "Moderately Active",
    "4": "Very Active",
    "5": "Extra Active",
  }

export default function ProfilePage() {
  const [userData, setUserData] = useState<QuizData>({
    name: "User",
    birthday: "",
    gender: "",
    height: 0,
    weight: 0,
    fitnessGoal: "",
    activityLevel: ""
  })

  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("fitnessUserData")
    if (stored) {
      setUserData(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
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
              <span className="font-medium">{userData.height} in</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{userData.weight} lbs</span>
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
              <span className="font-medium capitalize">{activityLevelMap[userData.activityLevel]}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
