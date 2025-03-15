"use client"

import { useState, useEffect } from "react"
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
import { AvatarUpload } from "@/components/avatar-upload"
import { uploadImage } from "@/lib/appwrite"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useAvatar } from "@/contexts/avatar-context"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { updateAvatar } = useAvatar()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    image: session?.user?.image || "",
  })

  // Debug logging
  useEffect(() => {
    console.log('Profile - Session:', session)
    console.log('Profile - Form Data:', formData)
  }, [session, formData])

  // 从 Firestore 获取用户数据
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const userRef = doc(db, "users", session.user.id)
          const userDoc = await getDoc(userRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setFormData(prev => ({
              ...prev,
              name: userData.name || session?.user?.name || "",
              email: userData.email || session?.user?.email || "",
              phone: userData.phone || "",
              image: userData.image || session?.user?.image || "",
            }))
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          toast({
            title: t("toast.error"),
            description: t("profile.fetchError"),
            variant: "destructive",
          })
        }
      }
    }

    fetchUserData()
  }, [session?.user?.id])

  // 监听 session 变化，更新 formData
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        phone: prev.phone, // 保留已有的电话号码
      }))
    }
  }, [session?.user?.image, session?.user?.name, session?.user?.email])

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || "Failed to update profile")
      }

      // Update the session with new user data
      await update({
        ...session,
        user: data,
      })

      // Show success message
      toast({
        title: t("profile.updated"),
        description: t("profile.updatedDescription"),
      })
    } catch (error) {
      console.error("Profile update error:", error)
      // Show error message
      toast({
        title: t("toast.error"),
        description: error instanceof Error ? error.message : t("toast.errorDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!session?.user?.id) {
      toast({
        title: t("toast.error"),
        description: t("auth.notAuthenticated"),
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const imageUrl = await uploadImage(file)
      console.log('Profile - New Image URL:', imageUrl) // Debug log
      
      // 更新 Firestore 中的用户数据
      const userRef = doc(db, "users", session.user.id)
      await updateDoc(userRef, {
        image: imageUrl
      })

      // 更新用户资料
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      })

      const data = await response.json()
      console.log('Profile - API Response:', data) // Debug log

      if (!response.ok) {
        throw new Error(data.details || "Failed to update profile")
      }

      // 更新表单数据
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
      }))

      // 更新 session
      const newSession = {
        ...session,
        user: {
          ...session.user,
          image: imageUrl,
        },
      }
      
      await update(newSession)
      updateAvatar(imageUrl) // 更新共享的头像状态
      console.log('Profile - Updated Avatar URL:', imageUrl) // Debug log

      toast({
        title: t("profile.uploadSuccess"),
      })
    } catch (error) {
      console.error("Failed to upload image:", error)
      toast({
        title: t("profile.uploadError"),
        description: error instanceof Error ? error.message : t("toast.errorDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
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
              <div className="flex justify-center">
                <AvatarUpload
                  currentImage={formData.image}
                  userName={session?.user?.name}
                  onImageUpload={handleImageUpload}
                />
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
                  disabled
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("profile.save")
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 