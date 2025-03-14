"use client"

import { useEffect } from "react"
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

export default function AppPage() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const router = useRouter()

  // 获取当前时间对应的表情
  const getTimeEmoji = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return t("welcome.emoji.morning")
    } else if (hour >= 12 && hour < 18) {
      return t("welcome.emoji.afternoon")
    } else {
      return t("welcome.emoji.evening")
    }
  }

  // 这里应该从你的状态管理或API中获取实际数据
  const stats = {
    totalTasks: 12,
    completedTasks: 5,
    pendingTasks: 7,
    completionRate: 41.67
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-6 bg-white dark:bg-black">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-auto px-2 pt-2 hover:!bg-transparent after:!content-none">
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline ml-1">{t("welcome.home")}</span>
              </Button>
            </Link>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold hidden ml-4 mt-1 sm:block">
              {t("welcome.headline")
                .replace("{username}", session?.user?.name || session?.user?.email?.split("@")[0] || "User")
                .replace("{emoji}", getTimeEmoji())}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <div className="w-px h-4 bg-border"></div>
            <ThemeToggle />
            <div className="w-px h-4 bg-border"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-sm truncate">{session?.user?.name || session?.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profile.title")}</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/logout">
                  <DropdownMenuItem className="cursor-pointer text-sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("auth.signOut")}</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="flex justify-center md:justify-center gap-8 md:gap-12 my-12 md:mb-10">
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow w-[140px] h-[120px]">
            <ListTodo className="h-5 w-5 md:h-6 md:w-6 text-primary mb-2" />
            <div className="text-lg md:text-xl font-bold text-primary">{stats.totalTasks}</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.total")}
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow w-[140px] h-[120px]">
            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-green-500 mb-2" />
            <div className="text-lg md:text-xl font-bold text-green-500">{stats.completedTasks}</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.completed")}
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow w-[140px] h-[120px]">
            <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-500 mb-2" />
            <div className="text-lg md:text-xl font-bold text-orange-500">{stats.pendingTasks}</div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              {t("task.pending")}
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow w-[140px] h-[120px]">
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

