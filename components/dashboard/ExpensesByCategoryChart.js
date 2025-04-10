"use client"

import { useEffect, useState } from "react"
import { useFinance } from "@/context/FinanceContext"
import { useTheme, Box, Typography, Paper, useMediaQuery } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { formatCurrency } from "@/utils/formatters"
import { styled } from "@mui/system"
import { motion } from "framer-motion"
import { DonutLarge } from "@mui/icons-material"

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
}))

const ChartHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}))

const ChartTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
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

const LegendContainer = styled(Box)(({ theme, ismobile }) => ({
  display: "flex",
  flexDirection: ismobile === "true" ? "row" : "column",
  flexWrap: ismobile === "true" ? "wrap" : "nowrap",
  justifyContent: ismobile === "true" ? "center" : "flex-start",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

const LegendItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(0.5),
  fontSize: "0.875rem",
}))

const LegendColor = styled(Box)(({ theme, color }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: theme.spacing(1),
}))

export default function ExpensesByCategoryChart() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { transactions } = useFinance()
  const [data, setData] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    if (transactions.length > 0) {
      // Filter only expense transactions
      const expenses = transactions.filter((transaction) => transaction.type === "expense")

      // Group expenses by category and sum amounts
      const categoryMap = expenses.reduce((acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      }, {})

      // Convert to array format for chart
      const chartData = Object.keys(categoryMap).map((category) => ({
        name: category,
        value: categoryMap[category],
      }))

      // Sort by value descending
      chartData.sort((a, b) => b.value - a.value)

      setData(chartData)
    } else {
      setData([])
    }
  }, [transactions])

  // Custom colors for the pie chart
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    "#9c27b0",
    "#795548",
    "#607d8b",
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: "10px 14px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" sx={{ color: payload[0].color, fontWeight: 500 }}>
            {formatCurrency(payload[0].value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
          </Typography>
        </Box>
      )
    }
    return null
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  // Custom legend component
  const renderCustomLegend = () => {
    return (
      <LegendContainer ismobile={isMobile ? "true" : "false"}>
        {data.map((entry, index) => (
          <motion.div
            key={`legend-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <LegendItem
              color={COLORS[index % COLORS.length]}
              sx={{
                fontWeight: activeIndex === index ? 600 : 400,
                color: activeIndex === index ? COLORS[index % COLORS.length] : "text.primary",
              }}
            >
              <LegendColor color={COLORS[index % COLORS.length]} />
              <Typography variant="body2" noWrap>
                {entry.name} ({((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%)
              </Typography>
            </LegendItem>
          </motion.div>
        ))}
      </LegendContainer>
    )
  }

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <DonutLarge sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <ChartTitle>Expenses by Category</ChartTitle>
        </ChartHeader>
        <EmptyStateContainer>
          <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            No expense data available
          </Typography>
          <Typography variant="body2" color="text.disabled" align="center">
            Add expenses to see your spending breakdown
          </Typography>
        </EmptyStateContainer>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <DonutLarge sx={{ color: theme.palette.primary.main, mr: 1 }} />
        <ChartTitle>Expenses by Category</ChartTitle>
      </ChartHeader>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: 300 }}>
        <Box sx={{ width: { xs: "100%", md: "60%" }, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 70 : 90}
                innerRadius={isMobile ? 40 : 60}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                    style={{
                      filter:
                        activeIndex === index ? `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]})` : "none",
                      opacity: activeIndex === null || activeIndex === index ? 1 : 0.6,
                      transition: "opacity 0.3s, filter 0.3s",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "40%" }, height: "100%", overflowY: "auto" }}>{renderCustomLegend()}</Box>
      </Box>
    </ChartContainer>
  )
}

