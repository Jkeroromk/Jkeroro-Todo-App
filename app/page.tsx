//首页

"use client"

import type React from "react"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, ListChecks, Calendar, Clock, Star, Sparkles, Zap, Shield, Users, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSession } from "next-auth/react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"

export default function Home() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      quote: t("testimonials.1.quote"),
      author: t("testimonials.1.author"),
      role: t("testimonials.1.role")
    },
    {
      quote: t("testimonials.2.quote"),
      author: t("testimonials.2.author"),
      role: t("testimonials.2.role")
    },
    {
      quote: t("testimonials.3.quote"),
      author: t("testimonials.3.author"),
      role: t("testimonials.3.role")
    }
  ]

  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-6 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-500 dark:bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -200, 0],
            y: [0, -100, 0],
            scale: [1.3, 1, 1.3],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-500 dark:bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -200, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gray-500 dark:bg-primary/20 rounded-full blur-xl"
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-transparent to-gray-200/50 dark:from-primary/20 dark:via-transparent dark:to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(255,255,255,0.4)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
      </div>

      <div ref={containerRef} className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 relative">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12 py-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{t("welcome.appName")}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="w-px h-4 bg-border"></div>
            <ThemeToggle />
          </div>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12 md:py-20 relative"
        >
          <div className="absolute inset-0 -z-10 bg-primary/5 dark:bg-primary/10 rounded-3xl blur-3xl"></div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary pb-6">{t("scroll.title")}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mx-auto mb-8 max-w-2xl">{t("welcome.subheadline")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session ? "/app" : "/login"}>
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                {t("welcome.getStarted")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-12 md:py-20 grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<ListChecks className="h-8 w-8" />}
            titleKey="feature.views.title"
            descriptionKey="feature.views.description"
            delay={0.6}
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8" />}
            titleKey="feature.dates.title"
            descriptionKey="feature.dates.description"
            delay={0.7}
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8" />}
            titleKey="feature.simple.title"
            descriptionKey="feature.simple.description"
            delay={0.8}
          />
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="py-12 md:py-20"
        >
          <div className="border border-border rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
            <div className="p-8 md:p-12">
              <div className="max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{t("cta.title")}</h2>
                <p className="text-muted-foreground mb-8 text-lg">{t("cta.description")}</p>
                <Link href={session ? "/app" : "/login"}>
                  <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">{t("cta.button")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="py-12 md:py-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t("stats.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="h-6 w-6" />}
              value="10K+"
              label={t("stats.users")}
            />
            <StatCard
              icon={<Zap className="h-6 w-6" />}
              value="1M+"
              label={t("stats.tasks")}
            />
            <StatCard
              icon={<Shield className="h-6 w-6" />}
              value="99.9%"
              label={t("stats.uptime")}
            />
            <StatCard
              icon={<Star className="h-6 w-6" />}
              value="4.9/5"
              label={t("stats.rating")}
            />
          </div>
        </motion.section>

        {/* New Testimonials Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t("testimonials.title")}
          </h2>
          <div className="border border-border rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
            <div className="p-8 md:p-12">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col"
              >
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-lg mb-6">{testimonials[currentTestimonial].quote}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="font-bold">{testimonials[currentTestimonial].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="py-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p>{t("footer.copyright")}</p>
        </motion.footer>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  titleKey,
  descriptionKey,
  delay,
}: {
  icon: React.ReactNode
  titleKey: string
  descriptionKey: string
  delay: number
}) {
  const { t } = useLanguage()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group border border-border rounded-xl p-6 text-center transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="inline-flex items-center justify-center p-3 mb-4 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary transform transition-transform group-hover:scale-110"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-3">{t(titleKey)}</h3>
      <p className="text-muted-foreground">{t(descriptionKey)}</p>
    </motion.div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-border"
    >
      <div className="text-primary mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}

