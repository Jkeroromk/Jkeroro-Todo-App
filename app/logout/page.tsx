"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"

export default function LogoutPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  const handleCancel = () => {
    router.push("/app")
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 md:p-8">
      <div className="container max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/app">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>{t("auth.backToApp")}</span>
            </Button>
          </Link>
          <div className="flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">{t("auth.signOut")}</CardTitle>
            <CardDescription>{t("auth.signOutDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {session?.user?.image && (
              <div className="mb-4">
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="rounded-full w-16 h-16"
                />
              </div>
            )}
            <p className="mb-4 text-center">
              {t("auth.signedInAs")} <strong>{session?.user?.name || session?.user?.email}</strong>
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              {t("auth.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleSignOut} disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              {t("auth.signOut")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

