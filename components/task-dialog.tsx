"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "./todo-app"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

type TaskDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void
  mode: "add" | "edit"
  initialData?: Task
}

export function TaskDialog({ isOpen, onClose, onSubmit, mode, initialData }: TaskDialogProps) {
  const { t, language } = useLanguage()
  const [title, setTitle] = useState(initialData?.title || "")
  const [category, setCategory] = useState<string | undefined>(initialData?.category)
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  )
  const [isIndefinite, setIsIndefinite] = useState(!initialData?.dueDate)

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (isOpen && initialData && mode === "edit") {
      setTitle(initialData.title)
      setCategory(initialData.category)
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : undefined)
      setIsIndefinite(!initialData.dueDate)
    } else if (isOpen && mode === "add") {
      setTitle("")
      setCategory(undefined)
      setDueDate(undefined)
      setIsIndefinite(true)
    }
  }, [isOpen, initialData, mode])

  const categoryOptions = ["Work", "Personal", "Shopping", "Health", "Finance", "Education", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      completed: initialData?.completed || false,
      category,
      dueDate: isIndefinite ? undefined : dueDate?.toISOString(),
    })

    onClose()
  }

  // 简单格式化日期，避免使用 date-fns 的 locale
  const formatDate = (date: Date) => {
    if (language === "zh") {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "add" ? t("addTask.title") : t("editTask.title")}</DialogTitle>
            <DialogDescription>
              {mode === "add" ? t("addTask.description") : t("editTask.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t("addTask.taskTitle")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("addTask.enterTitle")}
                required
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">{t("addTask.category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder={t("addTask.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`category.${option.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>{t("addTask.dueDate")}</Label>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="indefinite"
                    checked={isIndefinite}
                    onCheckedChange={(checked) => {
                      setIsIndefinite(checked === true)
                      if (checked) {
                        setDueDate(undefined)
                      }
                    }}
                  />
                  <Label htmlFor="indefinite" className="text-sm font-normal">
                    {t("addTask.noDeadline")}
                  </Label>
                </div>
              </div>
              <div className="relative">
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground",
                        !dueDate && "text-muted-foreground"
                      )}
                      disabled={isIndefinite}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {dueDate ? formatDate(dueDate) : t("addTask.pickDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <div className="rounded-md border bg-popover p-3 shadow-md">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => {
                          setDueDate(date)
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        lang={language}
                        className="rounded-md"
                        classNames={{
                          months: "space-y-4",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center gap-1",
                          caption_label: "text-sm font-medium",
                          nav: "flex items-center gap-1",
                          nav_button: cn(
                            "h-7 w-7 bg-transparent p-0 hover:opacity-100 hover:bg-accent",
                            "text-muted-foreground hover:text-accent-foreground rounded-md transition-colors"
                          ),
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: cn(
                            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                            "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                          ),
                          day: cn(
                            "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                            "hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                          ),
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_hidden: "invisible"
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("addTask.cancel")}
            </Button>
            <Button type="submit">
              {mode === "add" ? t("addTask.add") : t("editTask.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 