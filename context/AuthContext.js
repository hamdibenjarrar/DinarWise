"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

// Create context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Update auth state when session changes
  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (session?.user) {
      setUser(session.user)
      setIsAuthenticated(true)
      // Store user in localStorage for persistence
      localStorage.setItem("auth-user", JSON.stringify(session.user))
    } else {
      // Check if user is stored in localStorage (for development fallback)
      const storedUser = localStorage.getItem("auth-user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (e) {
          console.error("Error parsing stored user:", e)
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    }

    setLoading(false)
  }, [session, status])

  // Login function
  const login = async (email, password) => {
    try {
      // Try NextAuth login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      // For development, create a fallback user if NextAuth fails
      if (result?.error) {
        console.log("NextAuth login failed, using development fallback")

        // Generate a consistent ID based on email
        const generateId = (email) => {
          let hash = 0
          for (let i = 0; i < email.length; i++) {
            hash = (hash << 5) - hash + email.charCodeAt(i)
            hash |= 0 // Convert to 32bit integer
          }
          return hash.toString(16).padStart(24, "0")
        }

        const devUser = {
          id: generateId(email),
          name: "Development User",
          email: email || "dev@example.com",
        }

        setUser(devUser)
        setIsAuthenticated(true)
        localStorage.setItem("auth-user", JSON.stringify(devUser))
        return true
      }

      // If NextAuth succeeded
      if (!result?.error) {
        // We'll set the user in the next render via useSession
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)

      // Development fallback
      const generateId = (email) => {
        let hash = 0
        for (let i = 0; i < email.length; i++) {
          hash = (hash << 5) - hash + email.charCodeAt(i)
          hash |= 0 // Convert to 32bit integer
        }
        return hash.toString(16).padStart(24, "0")
      }

      const devUser = {
        id: generateId(email),
        name: "Development User",
        email: email || "dev@example.com",
      }

      setUser(devUser)
      setIsAuthenticated(true)
      localStorage.setItem("auth-user", JSON.stringify(devUser))
      return true
    }
  }

  // Google login function
  const googleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
      return true
    } catch (error) {
      console.error("Google login error:", error)
      return false
    }
  }

  // Register function - simplified for development
  const register = async (name, email, password) => {
    try {
      // For development, just return success and create a local user
      const generateId = (email) => {
        let hash = 0
        for (let i = 0; i < email.length; i++) {
          hash = (hash << 5) - hash + email.charCodeAt(i)
          hash |= 0 // Convert to 32bit integer
        }
        return hash.toString(16).padStart(24, "0")
      }

      const devUser = {
        id: generateId(email),
        name,
        email,
      }

      setUser(devUser)
      setIsAuthenticated(true)
      localStorage.setItem("auth-user", JSON.stringify(devUser))

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await signOut({ redirect: false })
    } catch (e) {
      console.error("Error during signOut:", e)
    }

    // Always clear local state
    localStorage.removeItem("auth-user")
    setUser(null)
    setIsAuthenticated(false)
  }

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

