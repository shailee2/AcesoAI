"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, User, Target, Activity } from "lucide-react"

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
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial")
  const [quizData, setQuizData] = useState<QuizData>({
    name: "",
    birthday: "",
    gender: "",
    height: 0,
    weight: 0,
    fitnessGoal: "",
    activityLevel: "",
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
            <Label htmlFor="name" className="text-sm font-medium text-white">
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
            <Label htmlFor="birthday" className="text-sm font-medium text-white">
              When's your birthday?
            </Label>
            <Input
              id="birthday"
              type="text"
              placeholder="MM/DD/YYYY"
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
            <Label className="text-sm font-medium block text-white">What's your gender?</Label>
            <RadioGroup value={quizData.gender} onValueChange={(value) => updateQuizData("gender", value)}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="text-white">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="text-white">
                    Female
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <Button
              variant={unitSystem === "imperial" ? "default" : "outline"}
              onClick={() => setUnitSystem("imperial")}
            >
              Imperial (ft, lbs)
            </Button>
            <Button variant={unitSystem === "metric" ? "default" : "outline"} onClick={() => setUnitSystem("metric")}>
              Metric (cm, kg)
            </Button>
          </div>
          {unitSystem === "imperial" ? (
            <>
              <div className="text-left">
                <Label className="text-sm font-medium block text-white">Height</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="ft"
                    value={Math.floor(quizData.height / 12) || ""}
                    onChange={(e) => {
                      const inches = quizData.height % 12
                      const ft = Number(e.target.value)
                      setQuizData((prev) => ({ ...prev, height: ft * 12 + inches }))
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="in"
                    value={quizData.height % 12 || ""}
                    onChange={(e) => {
                      const ft = Math.floor(quizData.height / 12)
                      const inches = Number(e.target.value)
                      setQuizData((prev) => ({ ...prev, height: ft * 12 + inches }))
                    }}
                  />
                </div>
              </div>
              <div className="text-left">
                <Label className="text-sm font-medium block text-white">Weight (lbs)</Label>
                <Input
                  type="number"
                  placeholder="lbs"
                  value={quizData.weight || ""}
                  onChange={(e) => setQuizData((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-left">
                <Label className="text-sm font-medium block text-white">Height (cm)</Label>
                <Input
                  type="number"
                  placeholder="Enter height in cm"
                  value={quizData.height > 0 ? quizData.height : ""}
                  onChange={(e) => setQuizData((prev) => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>
              <div className="text-left">
                <Label className="text-sm font-medium block text-white">Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="Enter weight in kg"
                  value={quizData.weight > 0 ? quizData.weight : ""}
                  onChange={(e) => setQuizData((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                />
              </div>
            </>
          )}
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
              <div
                key={goal.value}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50/10 border-gray-600"
              >
                <RadioGroupItem value={goal.value} id={goal.value} />
                <Label htmlFor={goal.value} className="flex-1 cursor-pointer">
                  <div className="font-medium text-white">{goal.label}</div>
                  <div className="text-sm text-gray-300">{goal.desc}</div>
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
              {
                value: "2",
                label: "Lightly Active",
                desc: "ex. Someone who walks a lot at work or goes to the gym twice a week.",
              },
              { value: "3", label: "Moderately Active", desc: "ex. Gym-goer lifting or doing cardio most weekdays." },
              {
                value: "4",
                label: "Very Active",
                desc: "ex. Athlete, personal trainer, or someone with daily intense workouts.",
              },
              {
                value: "5",
                label: "Extra Active",
                desc: "ex. Marathon runner in training or someone doing manual labor + daily gym sessions.",
              },
            ].map((level) => (
              <div
                key={level.value}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50/10 border-gray-600"
              >
                <RadioGroupItem value={level.value} id={level.value} />
                <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                  <div className="font-medium text-white">{level.label}</div>
                  <div className="text-sm text-gray-300">{level.desc}</div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome to myFitness.ai</h1>
          <p className="text-gray-300">Let's personalize your fitness journey</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-white">{currentStepData.title}</CardTitle>
            <div className="mt-4">
              <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
              <p className="text-sm text-gray-400 mt-2">
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
                  className="flex-1"
                  style={{ backgroundColor: "#8b0000", color: "#ededed" }}
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
