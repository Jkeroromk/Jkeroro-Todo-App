"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Loader2, Upload, X } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    image: session?.user?.image || "",
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call the API to update user data
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()

      // Update the session with new user data
      await update({
        ...session,
        user: updatedUser,
      })

      // Show success message
      toast({
        title: t("profile.success"),
        duration: 3000,
      })
    } catch (error) {
      // Show error message
      toast({
        title: t("profile.error"),
        variant: "destructive",
        duration: 3000,
      })
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }))
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

        <Card>
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>{t("auth.signedInAs")} {session?.user?.email}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Label htmlFor="avatar" className="cursor-pointer text-center">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={formData.image || undefined} />
                    <AvatarFallback>
                      {formData.name?.charAt(0) || formData.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2 flex gap-2 justify-center">
                    <Button type="button" variant="outline" size="sm" className="gap-1">
                      <Upload className="h-4 w-4" />
                      <span>{t("profile.uploadAvatar")}</span>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </Button>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeAvatar}
                        className="gap-1 text-destructive"
                      >
                        <X className="h-4 w-4" />
                        <span>{t("profile.removeAvatar")}</span>
                      </Button>
                    )}
                  </div>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{t("profile.name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t("profile.enterName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("profile.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder={t("profile.enterEmail")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("profile.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder={t("profile.enterPhone")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("profile.save")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 