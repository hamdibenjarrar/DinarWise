import { Box, Typography, Button, Container } from "@mui/material"
import Link from "next/link"

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" fontWeight="bold" sx={{ fontSize: { xs: "4rem", md: "6rem" } }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" fontWeight="medium">
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "500px", mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: "linear-gradient(90deg, #5C2AD2, #7B4DE3)",
            "&:hover": {
              background: "linear-gradient(90deg, #4A1CA8, #6C3FD0)",
            },
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  )
}

