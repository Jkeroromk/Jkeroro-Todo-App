"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type AvatarContextType = {
  avatarUrl: string | null
  updateAvatar: (url: string) => void
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined)

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Debug session status
  useEffect(() => {
    console.log('AvatarContext - Session Status:', status)
    console.log('AvatarContext - Session Data:', session)
  }, [session, status])

  // 初始化时从 session 获取头像
  useEffect(() => {
    console.log('AvatarContext - Session Image:', session?.user?.image)
    if (session?.user?.image) {
      setAvatarUrl(session.user.image)
      console.log('AvatarContext - Setting Initial Avatar:', session.user.image)
    }
  }, [session?.user?.image])

  const updateAvatar = (url: string) => {
    console.log('AvatarContext - Updating Avatar:', url)
    if (url) {
      setAvatarUrl(url)
      // Force a re-render by updating the state
      setTimeout(() => {
        console.log('AvatarContext - Confirming Avatar Update:', url)
      }, 100)
    }
  }

  // Debug current avatar URL
  useEffect(() => {
    console.log('AvatarContext - Current Avatar URL:', avatarUrl)
  }, [avatarUrl])

  const value = {
    avatarUrl: avatarUrl || session?.user?.image || null,
    updateAvatar
  }

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  )
}

export function useAvatar() {
  const context = useContext(AvatarContext)
  if (context === undefined) {
    throw new Error("useAvatar must be used within an AvatarProvider")
  }
  return context
} 