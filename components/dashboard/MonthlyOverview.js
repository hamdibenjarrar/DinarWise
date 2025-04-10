"use client"

import { useEffect, useState } from "react"
import { useFinance } from "@/context/FinanceContext"
import { Box, Paper, Typography, Grid, useTheme, LinearProgress, useMediaQuery } from "@mui/material"
import { styled } from "@mui/system"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { formatCurrency } from "@/utils/formatters"
import { TrendingUp, TrendingDown, AccountBalance, Savings } from "@mui/icons-material"
import { motion } from "framer-motion"

const OverviewContainer = styled(Paper)(({ theme }) => ({
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
    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
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

const StatCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2.5),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "light" ? theme.palette.background.paper : theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
  },
}))

const IconBox = styled(Box)(({ theme, color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: color,
  color: theme.palette.common.white,
  marginBottom: theme.spacing(1.5),
  boxShadow: `0 4px 8px ${color}40`,
}))

const StyledLinearProgress = styled(LinearProgress)(
  ({ theme, colorname }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
    "& .MuiLinearProgress-bar": {
      borderRadius: 4,
      background: `linear-gradient(90deg, ${theme.palette[colorname].main}, ${theme.palette[colorname].light})`,
    },
  }),
  {
    shouldForwardProp: (prop) => prop !== "colorname",
  },
)

export default function MonthlyOverview() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { transactions } = useFinance()
  const [monthlyData, setMonthlyData] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    savings: 0,
    expenseRatio: 0,
    savingsRatio: 0,
  })

  useEffect(() => {
    if (transactions.length > 0) {
      const now = new Date()
      const monthStart = startOfMonth(now)
      const monthEnd = endOfMonth(now)

      // Filter transactions for current month
      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= monthStart && transactionDate <= monthEnd
      })

      // Calculate monthly totals
      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      const savings = monthTransactions.filter((t) => t.type === "savings").reduce((sum, t) => sum + t.amount, 0)

      const balance = income - expenses - savings

      // Calculate ratios
      const expenseRatio = income > 0 ? (expenses / income) * 100 : 0
      const savingsRatio = income > 0 ? (savings / income) * 100 : 0

      setMonthlyData({
        income,
        expenses,
        balance,
        savings,
        expenseRatio,
        savingsRatio,
      })
    }
  }, [transactions])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  return (
    <OverviewContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Monthly Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {format(new Date(), "MMMM yyyy")}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <StatCard>
              <IconBox color={theme.palette.success.main}>
                <TrendingUp />
              </IconBox>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Monthly Income
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
                {formatCurrency(monthlyData.income)}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <StatCard>
              <IconBox color={theme.palette.error.main}>
                <TrendingDown />
              </IconBox>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Monthly Expenses
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
                {formatCurrency(monthlyData.expenses)}
              </Typography>
              <Box sx={{ mt: 1, mb: 0.5 }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={Math.min(monthlyData.expenseRatio, 100)}
                  colorname="error"
                />
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {monthlyData.expenseRatio.toFixed(0)}% of income
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <StatCard>
              <IconBox color={theme.palette.info.main}>
                <Savings />
              </IconBox>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Monthly Savings
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
                {formatCurrency(monthlyData.savings)}
              </Typography>
              <Box sx={{ mt: 1, mb: 0.5 }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={Math.min(monthlyData.savingsRatio, 100)}
                  colorname="info"
                />
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {monthlyData.savingsRatio.toFixed(0)}% of income
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <StatCard>
              <IconBox color={theme.palette.primary.main}>
                <AccountBalance />
              </IconBox>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Remaining Balance
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={
                  monthlyData.balance < 0 ? "error.main" : monthlyData.balance > 0 ? "success.main" : "text.primary"
                }
                sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
              >
                {formatCurrency(monthlyData.balance)}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
      </Grid>
    </OverviewContainer>
  )
}

