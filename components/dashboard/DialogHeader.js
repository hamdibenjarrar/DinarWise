"use client"

import { Box, IconButton } from "@mui/material"
import { styled } from "@mui/system"
import { Close as CloseIcon } from "@mui/icons-material"

// Create a styled Box component with warning as a string prop
const StyledDialogHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "warningHeader",
})(({ theme, warningHeader }) => {
  let bgColor

  if (warningHeader === "true") {
    bgColor =
      theme.palette.mode === "light"
        ? `linear-gradient(135deg, ${theme.palette.error.light}20, ${theme.palette.error.main}40)`
        : `linear-gradient(135deg, ${theme.palette.error.main}40, ${theme.palette.error.dark}60)`
  } else {
    bgColor =
      theme.palette.mode === "light"
        ? `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}40)`
        : `linear-gradient(135deg, ${theme.palette.primary.main}40, ${theme.palette.primary.dark}60)`
  }

  return {
    padding: theme.spacing(3),
    background: bgColor,
    color:
      warningHeader === "true"
        ? theme.palette.mode === "light"
          ? theme.palette.error.main
          : theme.palette.common.white
        : theme.palette.mode === "light"
          ? theme.palette.primary.main
          : theme.palette.common.white,
    fontWeight: 600,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }
})

export default function DialogHeader({ children, warningHeader, onClose }) {
  return (
    <StyledDialogHeader warningHeader={warningHeader ? "true" : "false"}>
      <Box>{children}</Box>
      {onClose && (
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </StyledDialogHeader>
  )
}

