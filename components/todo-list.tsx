"use client"

import { CheckCircle, Circle, Trash2, Calendar, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task } from "./todo-app"
import { useLanguage } from "@/contexts/language-context"

type TodoListProps = {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
}

export function TodoList({ tasks, onToggleCompletion, onDeleteTask, onEditTask }: TodoListProps) {
  const { t } = useLanguage()

  // Group tasks by completion status
  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  // Function to format date in a user-friendly way
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return t("date.today")
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t("date.tomorrow")
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">{t("task.pending")}</h2>
          <ul className="space-y-2">
            {pendingTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-2 p-3 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleCompletion(task.id)}
                  className="text-gray-400 hover:text-primary"
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  <Circle className="w-5 h-5" />
                </Button>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
                  {task.category && (
                    <Badge variant="outline" className="mt-1">
                      {t(`category.${task.category.toLowerCase()}`)}
                    </Badge>
                  )}
                </div>

                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(task.dueDate)}
                  </div>
                )}

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
        </section>
      )}

      {completedTasks.length > 0 && (
        <section className="opacity-75">
          <h2 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">{t("task.completed")}</h2>
          <ul className="space-y-2">
            {completedTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2 p-3 bg-card rounded-lg shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleCompletion(task.id)}
                  className="text-primary"
                  aria-label="Mark as incomplete"
                >
                  <CheckCircle className="w-5 h-5" />
                </Button>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-500 dark:text-gray-400 line-through truncate">{task.title}</p>
                  {task.category && (
                    <Badge variant="outline" className="mt-1 opacity-75">
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
        </section>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">{t("task.noTasks")}</p>
        </div>
      )}
    </div>
  )
}

