"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Check } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

const workoutData = {
  mon: { muscle: "Chest", exercises: ["Bench Press", "Incline Press", "Chest Flyes", "Push-ups"] },
  tue: { muscle: "Back", exercises: ["Pull-ups", "Rows", "Lat Pulldown", "Deadlifts"] },
  wed: { muscle: "Legs", exercises: ["Squats", "Lunges", "Leg Press", "Calf Raises"] },
  thu: { muscle: "Shoulders", exercises: ["Shoulder Press", "Lateral Raises", "Front Raises", "Rear Delts"] },
  fri: { muscle: "Arms", exercises: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Close Grip Press"] },
  sat: { muscle: "Core", exercises: ["Planks", "Crunches", "Russian Twists", "Mountain Climbers"] },
  sun: { muscle: "Rest", exercises: ["Stretching", "Light Walk", "Yoga", "Recovery"] },
}

export default function WorkoutDetail() {
  const params = useParams()
  const router = useRouter()
  const day = params.day as string
  const workout = workoutData[day as keyof typeof workoutData]

  const [workoutTable, setWorkoutTable] = useState(
    Array(10)
      .fill(null)
      .map(() => ({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
      })),
  )

  const [completedSets, setCompletedSets] = useState<boolean[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(4).fill(false)),
  )

  const handleInputChange = (rowIndex: number, field: string, value: string) => {
    const newTable = [...workoutTable]
    newTable[rowIndex] = { ...newTable[rowIndex], [field]: value }
    setWorkoutTable(newTable)
  }

  const toggleSetComplete = (rowIndex: number, setIndex: number) => {
    const newCompleted = [...completedSets]
    newCompleted[rowIndex][setIndex] = !newCompleted[rowIndex][setIndex]
    setCompletedSets(newCompleted)
  }

  if (!workout) {
    return <div>Workout not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold capitalize">
              {day} - {workout.muscle}
            </h1>
            <p className="text-sm text-gray-600">Track your workout</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggested Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {workout.exercises.map((exercise, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const emptyRow = workoutTable.findIndex((row) => !row.exercise)
                    if (emptyRow !== -1) {
                      handleInputChange(emptyRow, "exercise", exercise)
                    }
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {exercise}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workout Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Exercise</th>
                    <th className="text-center p-2">Sets</th>
                    <th className="text-center p-2">Reps</th>
                    <th className="text-center p-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutTable.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      <td className="p-2">
                        <Input
                          placeholder="Exercise name"
                          value={row.exercise}
                          onChange={(e) => handleInputChange(rowIndex, "exercise", e.target.value)}
                          className="text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1 justify-center">
                          {[1, 2, 3, 4].map((setNum) => (
                            <Button
                              key={setNum}
                              variant={completedSets[rowIndex][setNum - 1] ? "default" : "outline"}
                              size="sm"
                              className="w-6 h-6 p-0 text-xs"
                              onClick={() => toggleSetComplete(rowIndex, setNum - 1)}
                            >
                              {completedSets[rowIndex][setNum - 1] ? <Check className="h-3 w-3" /> : setNum}
                            </Button>
                          ))}
                        </div>
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="12"
                          value={row.reps}
                          onChange={(e) => handleInputChange(rowIndex, "reps", e.target.value)}
                          className="text-xs text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="lbs"
                          value={row.weight}
                          onChange={(e) => handleInputChange(rowIndex, "weight", e.target.value)}
                          className="text-xs text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg">
          Complete Workout
        </Button>
      </div>
    </div>
  )
}