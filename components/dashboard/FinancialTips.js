"use client"

import { useState } from "react"
import { Box, Paper, Typography, IconButton, useTheme, useMediaQuery, Divider, Chip } from "@mui/material"
import { styled } from "@mui/system"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lightbulb as LightbulbIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  TipsAndUpdates as TipsIcon,
} from "@mui/icons-material"

const TipsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
  },
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  },
}))

const TipBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "light" ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.15)",
  border: `1px solid ${theme.palette.mode === "light" ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.3)"}`,
  marginBottom: theme.spacing(2),
}))

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)",
  },
}))

const tips = [
  {
    title: "50/30/20 Rule",
    description: "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.",
    category: "Budgeting",
  },
  {
    title: "Emergency Fund",
    description: "Aim to save 3-6 months of living expenses in an easily accessible account for emergencies.",
    category: "Savings",
  },
  {
    title: "Debt Snowball Method",
    description: "Pay off your smallest debts first to build momentum, then tackle larger ones.",
    category: "Debt",
  },
  {
    title: "Track Every Expense",
    description: "Record all expenses, no matter how small, to understand your spending patterns.",
    category: "Tracking",
  },
  {
    title: "Automate Your Savings",
    description: "Set up automatic transfers to your savings account on payday to ensure consistent saving.",
    category: "Savings",
  },
  {
    title: "Review Subscriptions",
    description: "Regularly review your subscriptions and cancel those you don't use frequently.",
    category: "Expenses",
  },
  {
    title: "Use the 24-Hour Rule",
    description: "Wait 24 hours before making non-essential purchases to avoid impulse buying.",
    category: "Shopping",
  },
  {
    title: "Pay Yourself First",
    description: "Set aside money for savings goals before spending on discretionary items.",
    category: "Savings",
  },
]

export default function FinancialTips() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const handleNextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length)
  }

  const handlePrevTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length)
  }

  const currentTip = tips[currentTipIndex]

  return (
    <TipsContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TipsIcon
            sx={{
              color: theme.palette.warning.main,
              mr: 1,
              filter: `drop-shadow(0 2px 4px ${theme.palette.warning.main}40)`,
            }}
          />
          <Typography variant="h6" fontWeight="600">
            Financial Tips
          </Typography>
        </Box>
        <Chip
          label={`${currentTipIndex + 1}/${tips.length}`}
          size="small"
          sx={{
            bgcolor: theme.palette.warning.main + "20",
            color: theme.palette.warning.main,
            fontWeight: 600,
            borderRadius: 8,
          }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ position: "relative", minHeight: 150 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TipBox>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <LightbulbIcon sx={{ color: theme.palette.warning.main, mr: 1, mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                    {currentTip.title}
                  </Typography>
                  <Chip
                    label={currentTip.category}
                    size="small"
                    sx={{
                      mt: 0.5,
                      mb: 1,
                      fontSize: "0.7rem",
                      height: 20,
                      bgcolor: theme.palette.warning.main + "10",
                      color: theme.palette.warning.main,
                      borderRadius: 4,
                    }}
                  />
                  <Typography
                    variant="body2"
                    color={theme.palette.mode === "light" ? "text.primary" : "text.secondary"}
                  >
                    {currentTip.description}
                  </Typography>
                </Box>
              </Box>
            </TipBox>
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <NavButton onClick={handlePrevTip} size="small">
          <PrevIcon fontSize="small" />
        </NavButton>
        <NavButton onClick={handleNextTip} size="small">
          <NextIcon fontSize="small" />
        </NavButton>
      </Box>
    </TipsContainer>
  )
}

