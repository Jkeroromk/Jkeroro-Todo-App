"use client"

import { useState } from "react"
import { PlusCircle, Calendar, ListChecks, LayoutGrid, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoList } from "@/components/todo-list"
import { TodoGrid } from "@/components/todo-grid"
import { TodoCalendar } from "@/components/todo-calendar"
import { useLanguage } from "@/contexts/language-context"
import { useSession } from "next-auth/react"
import { useTasks } from "@/hooks/use-tasks"
import { TaskDialog } from "./task-dialog"
import { useToast } from "@/components/ui/use-toast"

export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: string
  dueDate?: string
  category?: string
  userId?: string
}

export default function TodoApp() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState("list")
  const { tasks, loading, addTask, toggleTaskCompletion, deleteTask, updateTask } = useTasks()

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleTaskSubmit = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData)
        toast({
          title: t("toast.taskUpdated"),
          description: taskData.title,
        })
        setEditingTask(null)
      } else {
        await addTask(taskData)
        toast({
          title: t("toast.taskAdded"),
          description: taskData.title,
        })
      }
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.errorDescription"),
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      toast({
        title: t("toast.taskDeleted"),
        description: t("toast.taskDeletedDescription"),
      })
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.errorDescription"),
        variant: "destructive",
      })
    }
  }

  const handleToggleCompletion = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId)
      const task = tasks.find(t => t.id === taskId)
      toast({
        title: task?.completed ? t("toast.taskUncompleted") : t("toast.taskCompleted"),
        description: task?.title,
      })
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.errorDescription"),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("app.title")}</h1>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-1">
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t("app.addTask")}</span>
          </Button>
        </div>

        <Tabs defaultValue="list" value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-sm mx-auto bg-secondary">
            <TabsTrigger value="list" className="flex items-center gap-1 data-[state=active]:bg-background">
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">{t("app.list")}</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-1 data-[state=active]:bg-background">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t("app.grid")}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1 data-[state=active]:bg-background">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{t("app.calendar")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main>
        {viewMode === "list" && (
          <TodoList 
            tasks={tasks} 
            onToggleCompletion={handleToggleCompletion}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}

        {viewMode === "grid" && (
          <TodoGrid 
            tasks={tasks} 
            onToggleCompletion={handleToggleCompletion}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}

        {viewMode === "calendar" && (
          <TodoCalendar 
            tasks={tasks} 
            onToggleCompletion={handleToggleCompletion}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}
      </main>

      <TaskDialog 
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        mode={editingTask ? "edit" : "add"}
        initialData={editingTask || undefined}
      />
    </div>
  )
}

