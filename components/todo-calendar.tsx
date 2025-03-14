"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { CheckCircle, Circle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task } from "./todo-app"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

type TodoCalendarProps = {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TodoCalendar({ tasks, onToggleCompletion, onDeleteTask }: TodoCalendarProps) {
  const { t, language } = useLanguage()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get all tasks with due dates
  const tasksWithDueDates = tasks.filter((task) => task.dueDate)

  // Create a map of dates to task counts (for the calendar display)
  const taskDateMap = tasksWithDueDates.reduce(
    (acc, task) => {
      if (task.dueDate) {
        const dateStr = task.dueDate.split("T")[0]
        acc[dateStr] = (acc[dateStr] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Get tasks for the selected date
  const getTasksForSelectedDate = () => {
    if (!selectedDate) return []

    const dateStr = selectedDate.toISOString().split("T")[0]
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      return task.dueDate.startsWith(dateStr)
    })
  }

  const tasksForSelectedDay = getTasksForSelectedDate()

  // Function to get task count for a date
  const getTaskCount = (date: Date | undefined) => {
    if (!date) return 0
    try {
      const dateString = date.toISOString().split("T")[0]
      return taskDateMap[dateString] || 0
    } catch (error) {
      return 0
    }
  }

  // 格式化日期
  const formatDate = (date: Date | undefined) => {
    if (!date) return ""

    if (language === "zh") {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.toLocaleDateString("zh-CN", { weekday: "long" })}`
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-2xl mx-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            modifiersStyles={{
              today: {
                fontWeight: "bold",
                color: "var(--primary)",
              },
            }}
            lang={language}
          />

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              {t("calendar.tasksFor")} {selectedDate?.toLocaleDateString(language === "zh" ? "zh-CN" : "en-US")}
            </h4>
            {getTaskCount(selectedDate) > 0 ? (
              <Badge>
                {getTaskCount(selectedDate)} {t("calendar.tasks")}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground">{t("calendar.noTasksScheduled")}</p>
            )}
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-medium mb-3">{formatDate(selectedDate)}</h3>

          {tasksForSelectedDay.length > 0 ? (
            <ul className="space-y-2">
              {tasksForSelectedDay.map((task) => (
                <li key={task.id} className="flex items-center gap-2 p-3 bg-card rounded-lg shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleCompletion(task.id)}
                    className={task.completed ? "text-primary" : "text-gray-400 hover:text-primary"}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"}`}
                    >
                      {task.title}
                    </p>
                    {task.category && (
                      <Badge variant="outline" className="mt-1">
                        {t(`category.${task.category.toLowerCase()}`)}
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-gray-400 hover:text-destructive"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4">{t("calendar.noTasksForDay")}</p>
          )}
        </div>
      </div>
    </div>
  )
}

