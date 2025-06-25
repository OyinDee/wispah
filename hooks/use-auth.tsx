"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiService, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  signup: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check for stored auth data on mount
    const checkStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem("wispah_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          // Validate the stored token by making a test API call
          try {
            await apiService.getUserMessages(userData.token)
            setUser(userData)
          } catch (error) {
            // Token is invalid, remove it
            localStorage.removeItem("wispah_user")
          }
        }
      } catch (error) {
        localStorage.removeItem("wispah_user")
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    checkStoredAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiService.loginUser(username, password)

      if (response.stat && response.token) {
        const userData = { username, token: response.token }
        setUser(userData)
        localStorage.setItem("wispah_user", JSON.stringify(userData))

        toast({
          title: "Welcome back! ✨",
          description: "You've successfully entered your secret chamber.",
        })
        return true
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiService.createUser(username, password)

      if (response.stat && response.token) {
        const userData = { username, token: response.token }
        setUser(userData)
        localStorage.setItem("wispah_user", JSON.stringify(userData))

        toast({
          title: "Chamber created! 🎉",
          description: "Welcome to your secret chamber of whispers.",
        })
        return true
      } else {
        toast({
          title: "Signup failed",
          description: response.message || "Unable to create account",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wispah_user")
    toast({
      title: "Goodbye! 👋",
      description: "You've safely exited your chamber.",
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading: isLoading || !isInitialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
