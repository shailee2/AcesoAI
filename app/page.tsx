"use client"

import { useEffect, useState } from "react"
import WelcomeQuiz, { QuizData } from "@/components/welcomequiz"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const completed = localStorage.getItem("fitnessQuizCompleted") === "true"
    setIsQuizCompleted(completed)
    setIsLoading(false)

    // If quiz is done, redirect to dashboard
    if (completed) {
      router.push("/dashboard")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Loading...
      </div>
    )
  }

  if (!isQuizCompleted) {
    return (
      <WelcomeQuiz
        onComplete={(quizData: QuizData) => {
          localStorage.setItem("fitnessQuizCompleted", "true")
          localStorage.setItem("fitnessUserData", JSON.stringify(quizData))
          router.push("/dashboard")
        }}
      />
    )
  }

  return null
}
