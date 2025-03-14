"use client"

import { CheckCircle, Circle, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Task } from "./todo-app"
import { useLanguage } from "@/contexts/language-context"

type TodoGridProps = {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TodoGrid({ tasks, onToggleCompletion, onDeleteTask }: TodoGridProps) {
  const { t } = useLanguage()

  // Sort tasks by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Function to format date in a user-friendly way
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sortedTasks.map((task) => (
        <Card key={task.id} className={task.completed ? "opacity-75" : ""}>
          <CardContent className="pt-6">
            <h3
              className={`font-medium ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-foreground"}`}
            >
              {task.title}
            </h3>

            {task.category && (
              <Badge variant="outline" className="mt-2">
                {t(`category.${task.category.toLowerCase()}`)}
              </Badge>
            )}

            {task.dueDate && (
              <div className="flex items-center mt-3 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-2 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleCompletion(task.id)}
              className={task.completed ? "text-primary" : "text-gray-400 hover:text-primary"}
            >
              {task.completed ? <CheckCircle className="w-5 h-5 mr-1" /> : <Circle className="w-5 h-5 mr-1" />}
              {task.completed ? t("task.done") : t("task.complete")}
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
          </CardFooter>
        </Card>
      ))}

      {tasks.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">{t("task.noTasks")}</p>
        </div>
      )}
    </div>
  )
}

