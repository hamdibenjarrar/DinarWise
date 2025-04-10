"use client"

import { SnackbarProvider as NotistackProvider } from "notistack"
import { styled } from "@mui/system"

const StyledSnackbarProvider = styled(NotistackProvider)(({ theme }) => ({
  "& .SnackbarContent-root": {
    borderRadius: "12px",
    padding: "8px 16px",
  },
  "& .SnackbarItem-contentRoot": {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  "& .SnackbarItem-variantSuccess": {
    backgroundColor: "#4CAF50",
  },
  "& .SnackbarItem-variantError": {
    backgroundColor: "#FF4A5E",
  },
  "& .SnackbarItem-variantWarning": {
    backgroundColor: "#F59E0B",
  },
  "& .SnackbarItem-variantInfo": {
    backgroundColor: "#33A9FF",
  },
}))

export default function SnackbarProvider({ children }) {
  return (
    <StyledSnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {children}
    </StyledSnackbarProvider>
  )
}

