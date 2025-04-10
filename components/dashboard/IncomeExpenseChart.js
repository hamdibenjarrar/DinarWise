"use client"

import { useEffect, useState } from "react"
import { useFinance } from "@/context/FinanceContext"
import { useTheme, useMediaQuery, Box, Typography } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { formatCurrency } from "@/utils/formatters"
import { styled } from "@mui/system"

// Update the ChartContainer component to be more responsive
const ChartContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    height: "250px", // Smaller height on mobile
  },
}))

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  color: theme.palette.text.secondary,
  padding: theme.spacing(3),
}))

export default function IncomeExpenseChart() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { transactions } = useFinance()
  const [data, setData] = useState([])

  useEffect(() => {
    if (transactions.length > 0) {
      // Get the last 6 months (or 3 for mobile)
      const monthCount = isMobile ? 3 : 6
      const months = Array.from({ length: monthCount }, (_, i) => {
        const date = subMonths(new Date(), i)
        return {
          month: format(date, "MMM"),
          fullMonth: format(date, "MMMM"),
          year: format(date, "yyyy"),
          startDate: startOfMonth(date),
          endDate: endOfMonth(date),
        }
      }).reverse()

      // Calculate income and expenses for each month
      const chartData = months.map((month) => {
        const monthTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          return transactionDate >= month.startDate && transactionDate <= month.endDate
        })

        const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        const savings = monthTransactions.filter((t) => t.type === "savings").reduce((sum, t) => sum + t.amount, 0)

        return {
          name: month.month,
          fullMonth: `${month.fullMonth} ${month.year}`,
          income,
          expenses,
          savings,
        }
      })

      setData(chartData)
    } else {
      setData([])
    }
  }, [transactions, isMobile])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const monthData = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: "12px 16px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
            boxShadow:
              theme.palette.mode === "light" ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
            fontSize: isMobile ? "0.8rem" : "0.875rem",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            {monthData.fullMonth}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: theme.palette.success.main,
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 500 }}>
              Income: {formatCurrency(monthData.income)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: theme.palette.error.main,
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: theme.palette.error.main, fontWeight: 500 }}>
              Expenses: {formatCurrency(monthData.expenses)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: theme.palette.info.main,
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: theme.palette.info.main, fontWeight: 500 }}>
              Savings: {formatCurrency(monthData.savings)}
            </Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <EmptyStateContainer>
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
          No transaction data available
        </Typography>
        <Typography variant="body2" color="text.disabled" align="center">
          Add transactions to see your monthly trends
        </Typography>
      </EmptyStateContainer>
    )
  }

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: isMobile ? 0 : 30, // Reduce right margin on mobile
            left: isMobile ? -15 : 20, // Adjust left margin on mobile
            bottom: 5,
          }}
          barGap={isMobile ? 1 : 2} // Reduce gap on mobile
          barSize={isMobile ? 10 : 16} // Smaller bars on mobile
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: theme.palette.divider }}
            tickLine={{ stroke: theme.palette.divider }}
          />
          <YAxis
            tickFormatter={(value) => `${value / 1000}k`}
            width={isMobile ? 30 : 40}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: theme.palette.divider }}
            tickLine={{ stroke: theme.palette.divider }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 10 }} iconType="circle" iconSize={8} />
          <Bar
            dataKey="income"
            name="Income"
            fill={theme.palette.success.main}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={theme.palette.error.main}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
          <Bar
            dataKey="savings"
            name="Savings"
            fill={theme.palette.info.main}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

