"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Loader2 } from "lucide-react"
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
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        setIsUploading(true)
        await onImageUpload(acceptedFiles[0])
        setIsOpen(false)
      } catch (error) {
        console.error("Failed to upload image:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"]
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noDragEventsBubbling: true
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
        <div className="flex flex-col gap-4">
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors",
              isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} disabled={isUploading} />
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            )}
            <p className="text-sm text-center text-muted-foreground mb-1">
              {isUploading ? t("profile.uploading") : isDragActive ? t("profile.dropHere") : t("profile.dragAndDrop")}
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    try {
                      setIsUploading(true);
                      await onImageUpload(file);
                      setIsOpen(false);
                    } catch (error) {
                      console.error("Failed to upload image:", error);
                    } finally {
                      setIsUploading(false);
                    }
                  }
                };
                input.click();
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("profile.uploading")}
                </>
              ) : (
                t("profile.selectFile")
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 