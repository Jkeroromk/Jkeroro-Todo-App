"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  currentImage?: string | null
  userName?: string | null
  onImageUpload: (file: File) => Promise<void>
  className?: string
}

export function AvatarUpload({ currentImage, userName, onImageUpload, className }: AvatarUploadProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        await onImageUpload(acceptedFiles[0])
        setIsOpen(false)
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"]
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-24 w-24 rounded-full hover:opacity-90 cursor-pointer",
            className
          )}
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentImage || undefined} alt={userName || "User avatar"} />
            <AvatarFallback className="text-2xl">
              {userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90">
            <Camera className="w-4 h-4 text-primary-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-center text-muted-foreground mb-1">
            {isDragActive ? t("profile.dropHere") : t("profile.dragAndDrop")}
          </p>
          <p className="text-xs text-center text-muted-foreground">
            {t("profile.or")}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {t("profile.selectFile")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 