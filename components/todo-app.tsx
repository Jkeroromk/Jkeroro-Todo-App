"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Calendar, ListChecks, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoList } from "@/components/todo-list"
import { TodoGrid } from "@/components/todo-grid"
import { TodoCalendar } from "@/components/todo-calendar"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { useLanguage } from "@/contexts/language-context"
import { useSession } from "next-auth/react"

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    if (session?.user?.id) {
      const savedTasks = localStorage.getItem(`tasks_${session.user.id}`)
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }
  }, [session])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (session?.user?.id) {
      localStorage.setItem(`tasks_${session.user.id}`, JSON.stringify(tasks))
    }
  }, [tasks, session])

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: session?.user?.id,
      ...task,
    }
    setTasks([...tasks, newTask])
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
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
          <TodoList tasks={tasks} onToggleCompletion={toggleTaskCompletion} onDeleteTask={deleteTask} />
        )}

        {viewMode === "grid" && (
          <TodoGrid tasks={tasks} onToggleCompletion={toggleTaskCompletion} onDeleteTask={deleteTask} />
        )}

        {viewMode === "calendar" && (
          <TodoCalendar tasks={tasks} onToggleCompletion={toggleTaskCompletion} onDeleteTask={deleteTask} />
        )}
      </main>

      <AddTaskDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAddTask={addTask} />
    </div>
  )
}

