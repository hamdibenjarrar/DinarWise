"use client"

import { AuthProvider } from "@/context/AuthContext"
import { SessionProvider } from "next-auth/react"
import { useState, useEffect } from "react"
import { CircularProgress, Box } from "@mui/material"

export function AuthSessionProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  )
}

