"use client"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { FinanceProvider } from "@/context/FinanceContext"
import { CssBaseline } from "@mui/material"
import { createContext } from "react"
import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import MuiThemeProvider from "./MuiThemeProvider"
import SnackbarProvider from "./SnackbarProvider"

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
})

export default function ClientProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#5C2AD2" }}>
          Loading DinarWise
        </Typography>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <MuiThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider>
          <CssBaseline />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <FinanceProvider>{children}</FinanceProvider>
          </Box>
        </SnackbarProvider>
      </LocalizationProvider>
    </MuiThemeProvider>
  )
}
