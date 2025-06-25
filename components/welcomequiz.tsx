"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Activity,
} from "lucide-react"

interface QuizData {
    name: string
    birthday: string
    gender: string
    weight: number
    height: number
    fitnessGoal: string
    activityLevel: string
  }

  const WelcomeQuiz = ({ onComplete }: { onComplete: (userData: QuizData) => void }) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [quizData, setQuizData] = useState<QuizData>({
      name: "",
      birthday: "",
      gender: "",
      height: 0,
      weight: 0,
      fitnessGoal: "",
      activityLevel: ""
    })
  
    const updateQuizData = (field: keyof QuizData, value: any) => {
      setQuizData((prev) => ({ ...prev, [field]: value }))
    }
  
  
    const canProceed = () => {
      switch (currentStep) {
        case 0:
          return quizData.name.trim() !== "" && quizData.birthday !== ""
        case 1:
          return quizData.height > 0 && quizData.weight > 0 && quizData.gender !== ""
        case 2:
          return quizData.fitnessGoal !== ""
        case 3:
          return quizData.activityLevel !== ""
        default:
          return false
      }
    }
  
    const handleSubmit = () => {
      onComplete(quizData)
    }
  
    const steps = [
      {
        title: "Let's get to know you",
        icon: User,
        content: (
          <div className="space-y-4">
            <div className="text-left">
              <Label htmlFor="name" className="text-sm font-medium">
                What's your name?
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={quizData.name}
                onChange={(e) => updateQuizData("name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="text-left">
              <Label htmlFor="birthday" className="text-sm font-medium">
                When's your birthday?
              </Label>
              <Input
                id="birthday"
                type="date"
                value={quizData.birthday}
                onChange={(e) => updateQuizData("birthday", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ),
      },
      {
        title: "Let's get to know you",
        icon: User,
        content: (
          <div className="space-y-4">
            <div className="text-left space-y-2">
              <Label className="text-sm font-medium block">What's your gender?</Label>
              <RadioGroup value={quizData.gender} onValueChange={(value) => updateQuizData("gender", value)}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
  
            <div className="text-left">
              <Label htmlFor="height" className="text-sm font-medium">
                What's your height (in)?
              </Label>
              <Input
                id="height"
                placeholder="Enter your height"
                value={quizData.height}
                onChange={(e) => updateQuizData("height", Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="text-left">
              <Label htmlFor="weight" className="text-sm font-medium">
                When's your weight (lbs)?
              </Label>
              <Input
                id="weight"
                placeholder="Enter your weight"
                value={quizData.weight}
                onChange={(e) => updateQuizData("weight", Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        ),
      },
      {
        title: "What's your main fitness goal?",
        icon: Target,
        content: (
          <RadioGroup value={quizData.fitnessGoal} onValueChange={(value) => updateQuizData("fitnessGoal", value)}>
            <div className="space-y-3">
              {[
                { value: "lose_weight", label: "Lose Weight", desc: "Burn fat and get leaner" },
                { value: "build_muscle", label: "Build Muscle", desc: "Gain strength and muscle mass" },
                { value: "get_fit", label: "Body Recomposition", desc: "Improve overall fitness and health" },
                { value: "maintain", label: "Maintain Weight", desc: "Maintain current fitness level" },
              ].map((goal) => (
                <div key={goal.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={goal.value} id={goal.value} />
                  <Label htmlFor={goal.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{goal.label}</div>
                    <div className="text-sm text-gray-600">{goal.desc}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ),
      },
      {
        title: "How active are you currently?",
        icon: Activity,
        content: (
          <RadioGroup value={quizData.activityLevel} onValueChange={(value) => updateQuizData("activityLevel", value)}>
            <div className="space-y-3">
              {[
                { value: "1", label: "Sedentary", desc: "ex. Office worker with no exercise routine." },
                { value: "2", label: "Lightly Active", desc: "ex. Someone who walks a lot at work or goes to the gym twice a week." },
                { value: "3", label: "Moderately Active", desc: "ex. Gym-goer lifting or doing cardio most weekdays." },
                { value: "4", label: "Very Active", desc: "ex. Athlete, personal trainer, or someone with daily intense workouts." },
                { value: "5", label: "Extra Active", desc: "ex. Marathon runner in training or someone doing manual labor + daily gym sessions."},
              ].map((level) => (
                <div key={level.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.desc}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ),
      }
    ]
  
    const currentStepData = steps[currentStep]
    const Icon = currentStepData.icon
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to myFitness.ai</h1>
            <p className="text-gray-600">Let's personalize your fitness journey</p>
          </div>
  
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              <div className="mt-4">
                <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
                <p className="text-sm text-gray-500 mt-2">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </CardHeader>
  
            <CardContent className="space-y-6">
              {currentStepData.content}
  
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
  
                {currentStep < steps.length - 1 ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()} className="flex-1">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Complete Setup
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
  
          <div className="flex justify-center mt-4 space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

export default WelcomeQuiz
export type { QuizData }