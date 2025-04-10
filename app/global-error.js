"use client"

import { Box, Typography, Button, Container, Paper } from "@mui/material"
import { styled } from "@mui/system"
import { ErrorOutline } from "@mui/icons-material"

const ErrorContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "24px",
  backgroundColor: "#f5f5f9",
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
  color: "#FF4A5E", // Hardcoded error color
  marginBottom: "16px",
})

export default function GlobalError({ error }) {
  // Define a local reset function since the prop might not be available
  const handleReset = () => {
    window.location.reload()
  }

  return (
    <html>
      <body>
        <ErrorContainer>
          <ErrorPaper>
            <ErrorIcon />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Something went wrong!
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              We're sorry, but there was a critical error. Please try refreshing the page or contact support.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{ borderRadius: 8, bgcolor: "#5C2AD2", "&:hover": { bgcolor: "#4A1CA8" } }}
              >
                Try again
              </Button>
            </Box>
          </ErrorPaper>
        </ErrorContainer>
      </body>
    </html>
  )
}

