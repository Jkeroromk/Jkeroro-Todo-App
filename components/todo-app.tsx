"use client"

import { useState } from "react"
import { PlusCircle, Calendar, ListChecks, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoList } from "@/components/todo-list"
import { TodoCalendar } from "@/components/todo-calendar"
import { useLanguage } from "@/contexts/language-context"
import { useSession } from "next-auth/react"
import { useTasks } from "@/hooks/use-tasks"
import { TaskDialog } from "./task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

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
  const [viewMode, setViewMode] = useState("calendar")
  const { tasks, loading, addTask, toggleTaskCompletion, deleteTask, updateTask } = useTasks()

  // Animation variants
  const tabVariants = {
    active: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      transition: { type: "spring", duration: 0.5 }
    },
    inactive: {
      backgroundColor: "transparent",
      color: "var(--foreground)",
      transition: { type: "spring", duration: 0.5 }
    }
  }

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }

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
      console.error('Task operation error:', error)
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
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <header className="flex flex-col gap-4">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("app.title")}</h1>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-1">
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t("app.addTask")}</span>
          </Button>
        </motion.div>

        <Tabs defaultValue="calendar" value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-secondary rounded-lg p-1">
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-1 data-[state=active]:bg-foreground dark:data-[state=active]:bg-background data-[state=active]:text-background dark:data-[state=active]:text-foreground rounded-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{t("app.calendar")}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="flex items-center gap-1 data-[state=active]:bg-foreground dark:data-[state=active]:bg-background data-[state=active]:text-background dark:data-[state=active]:text-foreground rounded-md transition-colors"
            >
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">{t("app.list")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={viewMode}
          initial="enter"
          animate="center"
          exit="exit"
          variants={contentVariants}
        >
          {viewMode === "calendar" && (
            <TodoCalendar 
              tasks={tasks} 
              onToggleCompletion={handleToggleCompletion}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          )}

          {viewMode === "list" && (
            <TodoList 
              tasks={tasks} 
              onToggleCompletion={handleToggleCompletion}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          )}
        </motion.main>
      </AnimatePresence>

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

