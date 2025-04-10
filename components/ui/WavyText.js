"use client"

import { useEffect, useRef } from "react"
import { animate, stagger } from "framer-motion"
import { Box } from "@mui/material"
import { styled } from "@mui/system"

const WavyContainer = styled(Box)({
  display: "inline-block",
  overflow: "hidden",
})

export default function WavyText({ text, color = "#5C2AD2", ...props }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Split text into individual characters
    const chars = containerRef.current.querySelectorAll(".wavy-char")

    // Animate each character
    const animation = animate(
      chars,
      { y: [-4, 4] },
      {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        ease: "easeInOut",
        duration: 1.5,
        delay: stagger(0.08, { startDelay: 0 }),
      },
    )

    return () => animation.stop()
  }, [])

  // Split text into spans for animation
  const renderWavyText = () => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="wavy-char"
        style={{
          display: "inline-block",
          willChange: "transform",
          color: color || "inherit",
        }}
      >
        {char}
      </span>
    ))
  }

  return (
    <span ref={containerRef} style={{ display: "inline-block", overflow: "hidden" }} {...props}>
      {renderWavyText()}
    </span>
  )
}

