"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useFinance } from "@/context/FinanceContext"
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
} from "@mui/material"
import { motion } from "framer-motion"
import { styled } from "@mui/system"
import DashboardLayout from "@/components/DashboardLayout"
import { formatCurrency } from "@/utils/formatters"
import BudgetPlanner from "@/components/dashboard/BudgetPlanner"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, CalendarToday, Category as CategoryIcon, DonutLarge } from "@mui/icons-material"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subYears,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from "date-fns"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: theme.palette.mode === "light" ? "0 4px 20px rgba(0, 0, 0, 0.05)" : "0 4px 20px rgba(0, 0, 0, 0.2)",
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
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.palette.mode === "light" ? "0 10px 25px rgba(0, 0, 0, 0.1)" : "0 10px 25px rgba(0, 0, 0, 0.3)",
  },
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
  borderRadius: 12,
  "& .MuiToggleButtonGroup-grouped": {
    margin: 4,
    borderRadius: 8,
    border: 0,
    textTransform: "none",
    fontWeight: 500,
    padding: "6px 12px",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}))

const StatCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 16,
  boxShadow: theme.palette.mode === "light" ? "0 4px 12px rgba(0, 0, 0, 0.05)" : "0 4px 12px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: color,
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
  boxShadow: `0 4px 8px ${color}40`,
}))

const CustomTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "" }) => {
  const theme = useTheme()

  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: "12px",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "8px",
          boxShadow: theme.palette.mode === "light" ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {valuePrefix}
              {entry.value.toLocaleString()}
              {valueSuffix}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }
  return null
}

// Create a Grid component that doesn't use the deprecated props
const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(3),
  width: "100%",
}))

export default function Analytics() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { isAuthenticated, loading } = useAuth()
  const { transactions } = useFinance()
  const [timeRange, setTimeRange] = useState("month")
  const [spendingData, setSpendingData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    avgDailyExpense: 0,
    topCategory: "",
    topCategoryAmount: 0,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (transactions.length > 0) {
      // Process data based on selected time range
      processTransactionData(timeRange)
    }
  }, [transactions, timeRange])

  const processTransactionData = (range) => {
    let startDate, endDate, intervalData
    const now = new Date()

    // Set date range based on selected time range
    switch (range) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        endDate = endOfWeek(now, { weekStartsOn: 1 })
        intervalData = eachDayOfInterval({ start: startDate, end: endDate })
        break
      case "month":
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        intervalData = eachDayOfInterval({ start: startDate, end: endDate })
        break
      case "year":
        startDate = startOfYear(now)
        endDate = endOfYear(now)
        intervalData = eachMonthOfInterval({ start: startDate, end: endDate })
        break
      case "all":
      default:
        // For all time, use the last 12 months
        startDate = startOfMonth(subYears(now, 1))
        endDate = endOfMonth(now)
        intervalData = eachMonthOfInterval({ start: startDate, end: endDate })
        break
    }

    // Filter transactions for the selected date range
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })

    // Process spending over time data
    const spendingOverTime = processSpendingOverTime(intervalData, filteredTransactions, range)
    setSpendingData(spendingOverTime)

    // Process spending by category data
    const spendingByCategory = processSpendingByCategory(filteredTransactions)
    setCategoryData(spendingByCategory)

    // Process daily spending data
    const dailySpending = processDailySpending(filteredTransactions, range)
    setDailyData(dailySpending)

    // Calculate summary statistics
    calculateSummaryStats(filteredTransactions, range)
  }

  const processSpendingOverTime = (intervalData, filteredTransactions, range) => {
    return intervalData.map((date) => {
      let dateTransactions
      let label

      if (range === "week" || range === "month") {
        // For week and month, group by day
        dateTransactions = filteredTransactions.filter((transaction) => isSameDay(new Date(transaction.date), date))
        label = format(date, "MMM d")
      } else {
        // For year and all time, group by month
        dateTransactions = filteredTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear()
        })
        label = format(date, "MMM yyyy")
      }

      const income = dateTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = dateTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      const savings = dateTransactions.filter((t) => t.type === "savings").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: label,
        income,
        expenses,
        savings,
        date,
      }
    })
  }

  const processSpendingByCategory = (filteredTransactions) => {
    // Group expenses by category
    const expensesByCategory = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      }, {})

    // Convert to array format for chart
    return Object.keys(expensesByCategory)
      .map((category) => ({
        name: category,
        value: expensesByCategory[category],
      }))
      .sort((a, b) => b.value - a.value)
  }

  const processDailySpending = (filteredTransactions, range) => {
    // For week and month, show daily spending
    // For year and all time, show monthly average
    if (range === "week" || range === "month") {
      const now = new Date()
      const startDate = range === "week" ? startOfWeek(now, { weekStartsOn: 1 }) : startOfMonth(now)
      const endDate = range === "week" ? endOfWeek(now, { weekStartsOn: 1 }) : endOfMonth(now)

      const days = eachDayOfInterval({ start: startDate, end: endDate })

      return days.map((day) => {
        const dayTransactions = filteredTransactions.filter((transaction) => isSameDay(new Date(transaction.date), day))

        const expenses = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
          name: format(day, "EEE"),
          date: format(day, "MMM d"),
          amount: expenses,
        }
      })
    } else {
      // For year and all time, show monthly spending
      const now = new Date()
      const startDate = range === "year" ? startOfYear(now) : startOfMonth(subYears(now, 1))
      const endDate = range === "year" ? endOfYear(now) : endOfMonth(now)

      const months = eachMonthOfInterval({ start: startDate, end: endDate })

      return months.map((month) => {
        const monthTransactions = filteredTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          return (
            transactionDate.getMonth() === month.getMonth() && transactionDate.getFullYear() === month.getFullYear()
          )
        })

        const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
          name: format(month, "MMM"),
          date: format(month, "MMM yyyy"),
          amount: expenses,
        }
      })
    }
  }

  const calculateSummaryStats = (filteredTransactions, range) => {
    // Calculate total income, expenses, and savings
    const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const totalSavings = filteredTransactions.filter((t) => t.type === "savings").reduce((sum, t) => sum + t.amount, 0)

    // Calculate average daily expense
    let avgDailyExpense = 0
    if (totalExpenses > 0) {
      const now = new Date()
      let dayCount

      switch (range) {
        case "week":
          dayCount = 7
          break
        case "month":
          dayCount = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
          break
        case "year":
          dayCount = 365
          break
        case "all":
          // Approximate for all time (12 months)
          dayCount = 365
          break
      }

      avgDailyExpense = totalExpenses / dayCount
    }

    // Find top expense category
    const expensesByCategory = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      }, {})

    let topCategory = ""
    let topCategoryAmount = 0

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = category
        topCategoryAmount = amount
      }
    })

    setSummaryData({
      totalIncome,
      totalExpenses,
      totalSavings,
      avgDailyExpense,
      topCategory,
      topCategoryAmount,
    })
  }

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange)
    }
  }

  // Custom colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    "#9c27b0",
    "#795548",
    "#607d8b",
  ]

  if (loading || !isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: isMobile ? "1.75rem" : "2.125rem",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Financial Analytics
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gain insights into your spending patterns and financial habits
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
            <StyledToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
              size={isMobile ? "small" : "medium"}
            >
              <ToggleButton value="week" aria-label="week">
                <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                Week
              </ToggleButton>
              <ToggleButton value="month" aria-label="month">
                <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                Month
              </ToggleButton>
              <ToggleButton value="year" aria-label="year">
                <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                Year
              </ToggleButton>
              <ToggleButton value="all" aria-label="all time">
                <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                All Time
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>

          {/* Summary Cards */}
          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              marginBottom: 3,
            }}
          >
            {/* Income Card */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <StatCard color={theme.palette.success.main}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <IconBox color={theme.palette.success.main}>
                        <TrendingUp />
                      </IconBox>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 2 }}>
                        Total Income
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {formatCurrency(summaryData.totalIncome)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {timeRange === "week"
                        ? "This week"
                        : timeRange === "month"
                          ? "This month"
                          : timeRange === "year"
                            ? "This year"
                            : "All time"}
                    </Typography>
                  </CardContent>
                </StatCard>
              </motion.div>
            </Box>

            {/* Expenses Card */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatCard color={theme.palette.error.main}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <IconBox color={theme.palette.error.main}>
                        <TrendingDown />
                      </IconBox>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 2 }}>
                        Total Expenses
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {formatCurrency(summaryData.totalExpenses)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {timeRange === "week"
                        ? "This week"
                        : timeRange === "month"
                          ? "This month"
                          : timeRange === "year"
                            ? "This year"
                            : "All time"}
                    </Typography>
                  </CardContent>
                </StatCard>
              </motion.div>
            </Box>

            {/* Savings Card */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StatCard color={theme.palette.info.main}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <IconBox color={theme.palette.info.main}>
                        <DonutLarge />
                      </IconBox>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 2 }}>
                        Total Savings
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {formatCurrency(summaryData.totalSavings)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {timeRange === "week"
                        ? "This week"
                        : timeRange === "month"
                          ? "This month"
                          : timeRange === "year"
                            ? "This year"
                            : "All time"}
                    </Typography>
                  </CardContent>
                </StatCard>
              </motion.div>
            </Box>

            {/* Top Category Card */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StatCard color={theme.palette.warning.main}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <IconBox color={theme.palette.warning.main}>
                        <CategoryIcon />
                      </IconBox>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 2 }}>
                        Top Category
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {summaryData.topCategory || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {summaryData.topCategoryAmount > 0
                        ? formatCurrency(summaryData.topCategoryAmount)
                        : "No expenses"}
                    </Typography>
                  </CardContent>
                </StatCard>
              </motion.div>
            </Box>
          </GridContainer>

          {/* Charts */}
          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                md: "6fr 6fr",
              },
              marginBottom: 3,
            }}
          >
            {/* Expenses by Category Chart */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StyledPaper>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <DonutLarge sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Expenses by Category
                    </Typography>
                  </Box>
                  <Box sx={{ height: 400, width: "100%" }}>
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={isMobile ? 100 : 130}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip valuePrefix="TND " />} />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Typography variant="body1" color="text.secondary">
                          No expense data available for the selected time range
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </StyledPaper>
              </motion.div>
            </Box>

            {/* Budget Planner */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <BudgetPlanner />
              </motion.div>
            </Box>
          </GridContainer>
        </motion.div>
      </Container>
    </DashboardLayout>
  )
}

