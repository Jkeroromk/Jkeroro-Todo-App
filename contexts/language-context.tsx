"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "zh"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // App
    "app.title": "Todo List",
    "app.addTask": "Add Task",
    "app.list": "List",
    "app.grid": "Grid",
    "app.calendar": "Calendar",
    "app.welcome": "Welcome back",

    // Task status
    "task.pending": "Pending",
    "task.completed": "Completed",
    "task.noTasks": "No tasks yet. Add your first task!",
    "task.complete": "Complete",
    "task.done": "Done",
    "task.total": "Total Tasks",
    "task.completionRate": "Completion Rate",
    "task.edit": "Edit",

    // Calendar
    "calendar.tasksFor": "Tasks for",
    "calendar.noTasksScheduled": "No tasks scheduled",
    "calendar.tasks": "task(s)",
    "calendar.noTasksForDay": "No tasks scheduled for this day.",

    // Add task dialog
    "addTask.title": "Add New Task",
    "addTask.description": "Fill in the task details below.",
    "addTask.taskTitle": "Task Title",
    "addTask.enterTitle": "Enter task title...",
    "addTask.category": "Category",
    "addTask.selectCategory": "Select a category",
    "addTask.dueDate": "Due Date",
    "addTask.pickDate": "Pick a date",
    "addTask.noDeadline": "No deadline",
    "addTask.cancel": "Cancel",
    "addTask.add": "Add Task",

    // Edit task dialog
    "editTask.title": "Edit Task",
    "editTask.description": "Modify the task details below.",
    "editTask.save": "Save Changes",

    // Categories
    "category.work": "Work",
    "category.personal": "Personal",
    "category.shopping": "Shopping",
    "category.health": "Health",
    "category.finance": "Finance",
    "category.education": "Education",
    "category.other": "Other",

    // Date formats
    "date.today": "Today",
    "date.tomorrow": "Tomorrow",

    // Theme
    "theme.toggle": "Toggle theme",

    // Language
    "language.toggle": "Switch to Chinese",

    // Welcome page
    "welcome.appName": "Jkeroro Todo",
    "welcome.headline": "Welcome back, {username} ! {emoji}",
    "welcome.subheadline":
      "A minimalist todo app from Jkeroro, focused on simplicity and efficiency. The black and white interface reduces visual distractions, helping you focus on completing tasks.",
    "welcome.getStarted": "Get Started",
    "welcome.home": "Home",
    "welcome.emoji.morning": "🌅",
    "welcome.emoji.afternoon": "☀️",
    "welcome.emoji.evening": "🌙",

    // Stats
    "stats.title": "Trusted by Thousands",
    "stats.users": "Active Users",
    "stats.tasks": "Tasks Created",
    "stats.uptime": "Uptime",
    "stats.rating": "User Rating",

    // Testimonials
    "testimonials.title": "What Our Users Say",
    "testimonials.1.quote": "Jkeroro Todo has completely transformed how I manage my daily tasks. The clean interface and powerful features make it a joy to use.",
    "testimonials.1.author": "Sarah Chen",
    "testimonials.1.role": "Product Manager",
    "testimonials.2.quote": "The calendar view and task organization features are exactly what I needed. It's now my go-to productivity tool.",
    "testimonials.2.author": "Michael Rodriguez",
    "testimonials.2.role": "Freelance Developer",
    "testimonials.3.quote": "Simple yet powerful. This app helps me stay focused and organized without any unnecessary complexity.",
    "testimonials.3.author": "Emma Thompson",
    "testimonials.3.role": "Business Owner",

    // Scroll section
    "scroll.title": "Ready to Transform Your Productivity?",
    "scroll.description": "Join thousands of users who have already discovered the power of Jkeroro Todo. Start your journey towards better task management today.",
    "scroll.button": "Get Started Now",

    // Features
    "feature.views.title": "Multiple Views",
    "feature.views.description": "List and calendar views for different organization needs",
    "feature.dates.title": "Date Management",
    "feature.dates.description": "Set due dates and view tasks through a calendar",
    "feature.simple.title": "Simple & Efficient",
    "feature.simple.description": "Focus on essential features without distractions",

    // Call to action
    "cta.title": "Ready to boost your productivity?",
    "cta.description":
      "Start using Jkeroro Todo to simplify your task management process. The black and white design reduces visual distractions, allowing you to focus on what matters.",
    "cta.button": "Start Now",

    // Footer
    "footer.copyright": "© {year} Jkeroro. Jkeroro Todo - A productivity tool from the Jkeroro brand.",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signInDescription": "Sign in to your account to continue",
    "auth.continueWithGithub": "Continue with GitHub",
    "auth.continueWithGoogle": "Continue with Google",
    "auth.termsNotice": "By signing in, you agree to our Terms of Service and Privacy Policy.",
    "auth.signOut": "Sign Out",
    "auth.signOutDescription": "Are you sure you want to sign out?",
    "auth.signedInAs": "Signed in as",
    "auth.cancel": "Cancel",
    "auth.backToApp": "Back to App",

    // Profile
    "profile.title": "Edit Profile",
    "profile.avatar": "Avatar",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.phone": "Phone",
    "profile.save": "Save Changes",
    "profile.success": "Profile updated successfully",
    "profile.error": "Failed to update profile",
    "profile.uploadAvatar": "Upload new avatar",
    "profile.removeAvatar": "Remove avatar",
    "profile.enterName": "Enter your name",
    "profile.enterEmail": "Enter your email",
    "profile.enterPhone": "Enter your phone number",
    "profile.updated": "Profile Updated",
    "profile.updatedDescription": "Your profile has been successfully updated",
    "profile.dragAndDrop": "Drag and drop an image here",
    "profile.dropHere": "Drop the image here",
    "profile.or": "or",
    "profile.selectFile": "Select from computer",
    "profile.uploadSuccess": "Avatar updated successfully",
    "profile.uploadError": "Failed to upload avatar",
    "profile.uploading": "Uploading...",

    // Toast notifications
    "toast.taskAdded": "Task Added",
    "toast.taskUpdated": "Task Updated",
    "toast.taskDeleted": "Task Deleted",
    "toast.taskDeletedDescription": "The task has been successfully deleted",
    "toast.taskCompleted": "Task Completed",
    "toast.taskUncompleted": "Task Marked as Incomplete",
    "toast.error": "Error",
    "toast.errorDescription": "An error occurred. Please try again.",
  },
  zh: {
    // App
    "app.title": "待办事项",
    "app.addTask": "添加任务",
    "app.list": "列表",
    "app.grid": "网格",
    "app.calendar": "日历",
    "app.welcome": "欢迎回来",

    // Task status
    "task.pending": "待完成",
    "task.completed": "已完成",
    "task.noTasks": "暂无任务。添加你的第一个任务！",
    "task.complete": "完成",
    "task.done": "已完成",
    "task.total": "总任务",
    "task.completionRate": "完成率",
    "task.edit": "编辑",

    // Calendar
    "calendar.tasksFor": "任务日期",
    "calendar.noTasksScheduled": "暂无安排任务",
    "calendar.tasks": "个任务",
    "calendar.noTasksForDay": "这一天没有安排任务。",

    // Add task dialog
    "addTask.title": "添加新任务",
    "addTask.description": "请在下方填写任务详情。",
    "addTask.taskTitle": "任务标题",
    "addTask.enterTitle": "输入任务标题...",
    "addTask.category": "分类",
    "addTask.selectCategory": "选择分类",
    "addTask.dueDate": "截止日期",
    "addTask.pickDate": "选择日期",
    "addTask.noDeadline": "无截止日期",
    "addTask.cancel": "取消",
    "addTask.add": "添加任务",

    // Edit task dialog
    "editTask.title": "编辑任务",
    "editTask.description": "在下方修改任务详情。",
    "editTask.save": "保存更改",

    // Categories
    "category.work": "工作",
    "category.personal": "个人",
    "category.shopping": "购物",
    "category.health": "健康",
    "category.finance": "财务",
    "category.education": "教育",
    "category.other": "其他",

    // Date formats
    "date.today": "今天",
    "date.tomorrow": "明天",

    // Theme
    "theme.toggle": "切换主题",

    // Language
    "language.toggle": "切换到英文",

    // Welcome page
    "welcome.appName": "Jkeroro 待办",
    "welcome.headline": "欢迎回来，{username}! {emoji}",
    "welcome.subheadline":
      "来自 Jkeroro 品牌的极简待办事项应用，专注于简约与效率。黑白界面减少视觉干扰，帮助你专注于完成任务。",
    "welcome.getStarted": "开始使用",
    "welcome.home": "首页",
    "welcome.emoji.morning": "🌅",
    "welcome.emoji.afternoon": "☀️",
    "welcome.emoji.evening": "🌙",

    // Stats
    "stats.title": "深受用户信赖",
    "stats.users": "活跃用户",
    "stats.tasks": "创建任务",
    "stats.uptime": "运行时间",
    "stats.rating": "用户评分",

    // Testimonials
    "testimonials.title": "用户心声",
    "testimonials.1.quote": "Jkeroro 待办完全改变了我的日常任务管理方式。简洁的界面和强大的功能让使用变得愉快。",
    "testimonials.1.author": "陈晓",
    "testimonials.1.role": "产品经理",
    "testimonials.2.quote": "日历视图和任务组织功能正是我所需要的。现在它是我首选的效率工具。",
    "testimonials.2.author": "罗德里格斯",
    "testimonials.2.role": "自由开发者",
    "testimonials.3.quote": "简单而强大。这个应用帮助我保持专注和条理，没有任何不必要的复杂性。",
    "testimonials.3.author": "艾玛·汤普森",
    "testimonials.3.role": "企业主",

    // Scroll section
    "scroll.title": "准备好提升你的效率了吗？",
    "scroll.description": "加入已经发现 Jkeroro 待办强大功能的数千用户。今天就开始你的任务管理之旅。",
    "scroll.button": "立即开始",

    // Features
    "feature.views.title": "多种视图",
    "feature.views.description": "列表和日历视图满足不同的组织需求",
    "feature.dates.title": "日期管理",
    "feature.dates.description": "设置截止日期并通过日历查看任务安排",
    "feature.simple.title": "简单高效",
    "feature.simple.description": "专注于必要功能，没有多余的干扰",

    // Call to action
    "cta.title": "准备好提高效率了吗？",
    "cta.description": "开始使用 Jkeroro 待办，简化你的任务管理流程。黑白设计减少视觉干扰，让你专注于重要的事情。",
    "cta.button": "立即开始",

    // Footer
    "footer.copyright": "© {year} Jkeroro。Jkeroro 待办 - Jkeroro 品牌旗下的生产力工具。",

    // Auth
    "auth.signIn": "登录",
    "auth.signInDescription": "登录您的账户以继续",
    "auth.continueWithGithub": "使用 GitHub 登录",
    "auth.continueWithGoogle": "使用 Google 登录",
    "auth.termsNotice": "登录即表示您同意我们的服务条款和隐私政策。",
    "auth.signOut": "退出登录",
    "auth.signOutDescription": "您确定要退出登录吗？",
    "auth.signedInAs": "已登录为",
    "auth.cancel": "取消",
    "auth.backToApp": "返回应用",

    // Profile
    "profile.title": "编辑个人资料",
    "profile.avatar": "头像",
    "profile.name": "姓名",
    "profile.email": "邮箱",
    "profile.phone": "电话",
    "profile.save": "保存更改",
    "profile.success": "个人资料更新成功",
    "profile.error": "个人资料更新失败",
    "profile.uploadAvatar": "上传新头像",
    "profile.removeAvatar": "移除头像",
    "profile.enterName": "请输入您的姓名",
    "profile.enterEmail": "请输入您的邮箱",
    "profile.enterPhone": "输入您的电话号码",
    "profile.updated": "资料已更新",
    "profile.updatedDescription": "您的个人资料已成功更新",
    "profile.dragAndDrop": "拖拽图片到这里",
    "profile.dropHere": "放开以上传图片",
    "profile.or": "或",
    "profile.selectFile": "从电脑选择",
    "profile.uploadSuccess": "头像更新成功",
    "profile.uploadError": "头像上传失败",
    "profile.uploading": "正在上传...",

    // Toast notifications
    "toast.taskAdded": "任务已添加",
    "toast.taskUpdated": "任务已更新",
    "toast.taskDeleted": "任务已删除",
    "toast.taskDeletedDescription": "任务已成功删除",
    "toast.taskCompleted": "任务已完成",
    "toast.taskUncompleted": "任务标记为未完成",
    "toast.error": "错误",
    "toast.errorDescription": "发生错误，请重试。",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 默认使用浏览器语言，如果是中文则使用中文，否则使用英文
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      setLanguage(savedLanguage)
    } else {
      // 检测浏览器语言
      const browserLanguage = navigator.language.toLowerCase()
      if (browserLanguage.startsWith("zh")) {
        setLanguage("zh")
      }
    }
  }, [])

  // 当语言改变时保存到本地存储
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // 翻译函数
  const t = (key: string): string => {
    const translation = (translations[language] as { [key: string]: string })[key]
    if (!translation) return key

    // 处理特殊变量，如年份
    if (key === "footer.copyright") {
      return translation.replace("{year}", new Date().getFullYear().toString())
    }

    return translation
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

