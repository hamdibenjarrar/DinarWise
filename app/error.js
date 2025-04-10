"use client"

import { useEffect } from "react"
import { Box, Typography, Button, Container, Paper } from "@mui/material"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"
import { ErrorOutline } from "@mui/icons-material"

const ErrorContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "24px",
})

const ErrorPaper = styled(Paper)({
  padding: "32px",
  borderRadius: "16px",
  textAlign: "center",
  maxWidth: 500,
  width: "100%",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
})

const ErrorIcon = styled(ErrorOutline)({
  fontSize: 80,
  color: "#FF4A5E", // Hardcoded error color instead of using theme
  marginBottom: "16px",
})

export default function Error({ error, reset }) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  // Define a fallback reset function in case the prop is not provided
  const handleReset = () => {
    if (typeof reset === "function") {
      reset()
    } else {
      // Fallback: reload the page
      window.location.reload()
    }
  }

  return (
    <ErrorContainer>
      <ErrorPaper>
        <ErrorIcon />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Something went wrong!
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We're sorry, but there was an error processing your request. Please try again or contact support if the
          problem persists.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleReset} sx={{ borderRadius: 8 }}>
            Try again
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            sx={{ borderRadius: 8, bgcolor: "#5C2AD2", "&:hover": { bgcolor: "#4A1CA8" } }}
          >
            Go to Home
          </Button>
        </Box>
      </ErrorPaper>
    </ErrorContainer>
  )
}

