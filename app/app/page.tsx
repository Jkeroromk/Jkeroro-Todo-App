"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import TodoApp from "@/components/todo-app"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import { Home, LogOut, Loader2, User, CheckCircle2, Clock, ListTodo, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTasks } from "@/hooks/use-tasks"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAvatar } from "@/contexts/avatar-context"

export default function AppPage() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const router = useRouter()
  const { tasks } = useTasks()
  const { avatarUrl } = useAvatar()

  // Debug logging
  useEffect(() => {
    console.log('Session image:', session?.user?.image)
    console.log('Avatar URL:', avatarUrl)
  }, [session?.user?.image, avatarUrl])

  const getTimeEmoji = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return "🌅" // 早上
    } else if (hour >= 12 && hour < 18) {
      return "☀️" // 下午
    } else if (hour >= 18 && hour < 22) {
      return "🌙" // 晚上
    } else {
      return "🌛" // 深夜
    }
  }

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const stats = {
    totalTasks,
    completedTasks,
    pendingTasks: totalTasks - completedTasks,
    completionRate,
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto px-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <Home className="w-5 h-5" />
                {t("welcome.home")}
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={avatarUrl || session?.user?.image || undefined}
                      alt={session?.user?.name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0]?.toUpperCase() || <User className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full flex items-center cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    <span>{t("profile.title")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/api/auth/signout"
                    className="w-full flex items-center cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>{t("auth.signOut")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-2xl font-bold">
            {t("app.welcome")}，{session?.user?.name?.split(" ")[0] || "User"}! {getTimeEmoji()}
          </h1>
        {/* <p className="text-muted-foreground max-w-2xl">{t("welcome.subheadline")}</p> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 my-12 md:mb-10">
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ListTodo className="h-5 w-5 md:h-6 md:w-6 text-primary mb-2" />
            <div className="text-lg md:text-xl font-bold text-primary">{stats.totalTasks}</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.total")}
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-green-500 mb-2" />
            <div className="text-lg md:text-xl font-bold text-green-500">{stats.completedTasks}</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.completed")}
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-500 mb-2" />
            <div className="text-lg md:text-xl font-bold text-orange-500">{stats.pendingTasks}</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.pending")}
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <PieChart className="h-5 w-5 md:h-6 md:w-6 text-blue-500 mb-2" />
            <div className="text-lg md:text-xl font-bold text-blue-500">{stats.completionRate}%</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.completionRate")}
            </div>
          </div>
        </div>

        <TodoApp />
      </div>
    </main>
  )
}

