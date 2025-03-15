"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { CheckCircle, Circle, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task } from "./todo-app"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type TodoCalendarProps = {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
}

export function TodoCalendar({ tasks, onToggleCompletion, onDeleteTask, onEditTask }: TodoCalendarProps) {
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
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="w-full">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border w-full"
          lang={language}
          components={{
            DayContent: ({ date }) => {
              const count = getTaskCount(date)
              return (
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-0.5">
                  <div className="text-sm">{date.getDate()}</div>
                  {count > 0 && (
                    <div className="flex gap-0.5 items-center">
                      {[...Array(Math.min(count, 5))].map((_, i) => (
                        <div key={i} className="h-1 w-1 rounded-full bg-primary" />
                      ))}
                    </div>
                  )}
                </div>
              )
            },
          }}
        />
      </div>

      <div className="w-full bg-card rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4 px-2 text-center">{formatDate(selectedDate)}</h3>

        <ScrollArea className={cn(
          "transition-all duration-200",
          tasksForSelectedDay.length > 0 ? "h-[calc(100vh-32rem)]" : "h-16"
        )}>
          {tasksForSelectedDay.length > 0 ? (
            <ul className="space-y-2 px-2">
              {tasksForSelectedDay.map((task) => (
                <li key={task.id} className="flex items-center gap-2 p-3 bg-background rounded-lg shadow-sm">
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
                    onClick={() => onEditTask(task)}
                    className="text-gray-400 hover:text-primary"
                    aria-label="Edit task"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

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
            <p className="text-gray-500 dark:text-gray-400 py-4 px-2 text-center">{t("calendar.noTasksForDay")}</p>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

