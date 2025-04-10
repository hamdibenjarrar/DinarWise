"use client"

import { Box } from "@mui/material"
import { styled } from "@mui/system"

const DotsContainer = styled(Box)(({ theme, color = "#5C2AD2" }) => ({
  display: "flex",
  gap: "8px",
  justifyContent: "center",
  alignItems: "center",
}))

const Dot = styled(Box)(({ theme, color = "#5C2AD2", delay = 0 }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: color,
  animation: "bounce 0.6s infinite alternate",
  animationDelay: `${delay}s`,
  "@keyframes bounce": {
    "0%": {
      transform: "translateY(0)",
    },
    "100%": {
      transform: "translateY(-10px)",
    },
  },
}))

export default function LoadingDots({ color = "#5C2AD2", ...props }) {
  return (
    <DotsContainer color={color} {...props}>
      <Dot color={color} delay={0} />
      <Dot color={color} delay={0.2} />
      <Dot color={color} delay={0.4} />
    </DotsContainer>
  )
}

