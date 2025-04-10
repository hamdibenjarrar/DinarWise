"use client"

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import { useTheme } from "@/components/theme-provider"
import { useMemo } from "react"

export default function ThemeProvider({ children }) {
  const { theme: colorMode } = useTheme()

  // Create a theme instance based on the color mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode === "dark" ? "dark" : "light",
          primary: {
            main: "#5C2AD2",
          },
          secondary: {
            main: "#7B4DE3",
          },
          error: {
            main: "#FF4A5E",
          },
          warning: {
            main: "#F59E0B",
          },
          info: {
            main: "#33A9FF",
          },
          success: {
            main: "#4CAF50",
          },
          background: {
            default: colorMode === "dark" ? "#121212" : "#f5f5f9",
            paper: colorMode === "dark" ? "#1e1e1e" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "var(--font-poppins), var(--font-inter), sans-serif",
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [colorMode],
  )

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

