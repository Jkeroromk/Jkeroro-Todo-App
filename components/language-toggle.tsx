"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en")
  }

  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      aria-label={t("language.toggle")}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{t("language.toggle")}</span>
    </Button>
  )
}

