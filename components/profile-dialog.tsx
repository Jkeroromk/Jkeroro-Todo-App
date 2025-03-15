"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/language-context"
import { Camera } from "lucide-react"

type ProfileDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProfileData) => void
  initialData: ProfileData
}

export type ProfileData = {
  name: string
  email: string
  image?: string
}

export function ProfileDialog({ isOpen, onClose, onSubmit, initialData }: ProfileDialogProps) {
  const { t } = useLanguage()
  const [name, setName] = useState(initialData.name || "")
  const [email, setEmail] = useState(initialData.email || "")
  const [imageUrl, setImageUrl] = useState(initialData.image || "")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      image: imageUrl
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      // TODO: 实现图片上传到存储服务的逻辑
      // const url = await uploadImage(file)
      // setImageUrl(url)
    } catch (error) {
      console.error("Failed to upload image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("profile.title")}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={imageUrl} alt={name} />
                  <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">{t("profile.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("profile.enterName")}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("profile.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("profile.enterEmail")}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("profile.cancel")}
            </Button>
            <Button type="submit" disabled={isUploading}>
              {t("profile.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 