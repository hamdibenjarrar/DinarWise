"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, CircularProgress, Typography } from "@mui/material"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push("/login")
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1">Redirecting to login...</Typography>
    </Box>
  )
}

