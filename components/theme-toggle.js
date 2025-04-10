"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { IconButton, Tooltip } from "@mui/material"
import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <Tooltip title={`Theme: ${theme || "system"}`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          borderRadius: "10px",
          padding: "8px",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {theme === "light" ? <LightMode /> : theme === "dark" ? <DarkMode /> : <SettingsBrightness />}
      </IconButton>
    </Tooltip>
  )
}

