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
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
} from "@mui/material"
import { format, isToday, isSameDay, addMonths, subMonths } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { styled } from "@mui/system"
import DashboardLayout from "@/components/DashboardLayout"
import TransactionDialog from "@/components/dashboard/TransactionDialog"
import { formatCurrency } from "@/utils/formatters"
import {
  Add as AddIcon,
  ReceiptLong as ReceiptLongIcon,
  FilterList as FilterListIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Savings as SavingsIcon,
  Event as EventIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material"

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(135deg, rgba(92, 42, 210, 0.15) 0%, rgba(30, 21, 80, 0.3) 100%)",
  backdropFilter: "blur(4px)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #7B4DE3)`,
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

const DayTransactionsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(135deg, rgba(92, 42, 210, 0.15) 0%, rgba(30, 21, 80, 0.3) 100%)",
  backdropFilter: "blur(4px)",
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
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  },
}))

const TransactionItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
    transform: "translateX(5px)",
  },
  // Ensure the container doesn't expand beyond available space
  width: "100%",
  maxWidth: "100%",
}))

const StyledChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: 8,
  fontWeight: 600,
  backgroundColor: color ? `${color}20` : undefined,
  color: color,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}))

const AddButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: `0 4px 8px ${theme.palette.primary.main}40`,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: `0 6px 10px ${theme.palette.primary.main}60`,
  },
}))

const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 500,
  padding: "6px 12px",
  backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
  },
}))

const SummaryCard = styled(Box)(({ theme, type }) => {
  let color
  switch (type) {
    case "income":
      color = theme.palette.success.main
      break
    case "expense":
      color = theme.palette.error.main
      break
    case "savings":
      color = theme.palette.info.main
      break
    default:
      color = theme.palette.primary.main
  }

  return {
    padding: theme.spacing(1.5),
    borderRadius: 12,
    backgroundColor: `${color}10`,
    border: `1px solid ${color}30`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  }
})

const IconContainer = styled(Box)(({ theme, color }) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  backgroundColor: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
  marginRight: theme.spacing(1.5),
  boxShadow: `0 4px 8px ${color}40`,
}))

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(1),
  },
}))

const CalendarNavigation = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}))

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "1px",
  backgroundColor: theme.palette.divider,
  borderRadius: 12,
  overflow: "hidden",
}))

// Fix: Use a proper styled component for CalendarDay that accepts custom props
const CalendarDay = styled(Box, {
  shouldForwardProp: (prop) => !["isCurrentMonth", "isSelected", "isToday", "hasTransactions"].includes(prop),
})(({ theme, isCurrentMonth, isSelected, isToday, hasTransactions }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  minHeight: "80px",
  position: "relative",
  cursor: "pointer",
  opacity: isCurrentMonth ? 1 : 0.5,
  border: isSelected ? `2px solid ${theme.palette.primary.main}` : "none",
  backgroundImage: hasTransactions
    ? "radial-gradient(circle at 70% 70%, rgba(92, 42, 210, 0.1) 0%, transparent 50%)"
    : "none",
  ...(isToday && {
    "&::after": {
      content: '""',
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px rgba(92, 42, 210, 0.3)`,
    },
  }),
  "&:hover": {
    backgroundColor: "rgba(92, 42, 210, 0.08)",
    transform: "translateY(-2px)",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  },
  [theme.breakpoints.down("sm")]: {
    minHeight: "60px",
    padding: theme.spacing(0.5),
  },
}))

// Fix: Use a proper styled component for DayNumber that accepts custom props
const DayNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isToday",
})(({ theme, isToday }) => ({
  fontWeight: isToday ? 700 : 400,
  color: isToday ? theme.palette.primary.main : theme.palette.text.primary,
}))

const TransactionDot = styled(Box)(({ theme, color }) => ({
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: color,
  display: "inline-block",
  margin: "0 2px",
  boxShadow: `0 0 0 1px ${theme.palette.background.paper}, 0 0 0 2px ${color}40`,
}))

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(92, 42, 210, 0.1)",
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: "rgba(92, 42, 210, 0.2)",
    transform: "translateY(-2px)",
    transition: "transform 0.2s ease",
  },
}))

// Create a Grid component that doesn't use the deprecated props
const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(3),
  width: "100%",
}))

export default function CalendarPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { isAuthenticated, loading } = useAuth()
  const { transactions } = useFinance()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false)
  const [transactionType, setTransactionType] = useState("expense")
  const [dayTransactions, setDayTransactions] = useState([])
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [filter, setFilter] = useState("all")
  const openFilter = Boolean(filterAnchorEl)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Update day transactions when selected date changes
  useEffect(() => {
    if (selectedDate && transactions.length > 0) {
      // Format dates to compare only year, month, day
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd")

      let filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const transactionDateStr = format(transactionDate, "yyyy-MM-dd")
        return transactionDateStr === selectedDateStr
      })

      // Apply type filter if not "all"
      if (filter !== "all") {
        filtered = filtered.filter((transaction) => transaction.type === filter)
      }

      setDayTransactions(filtered)
    } else {
      setDayTransactions([])
    }
  }, [selectedDate, transactions, filter])

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    handleFilterClose()
  }

  const handleAddTransaction = (type) => {
    setTransactionType(type)
    setOpenTransactionDialog(true)
  }

  // Get color based on transaction type
  const getTypeColor = (type) => {
    switch (type) {
      case "income":
        return theme.palette.success.main
      case "expense":
        return theme.palette.error.main
      case "savings":
        return theme.palette.info.main
      default:
        return theme.palette.primary.main
    }
  }

  // Get icon based on transaction type
  const getTypeIcon = (type) => {
    switch (type) {
      case "income":
        return <IncomeIcon />
      case "expense":
        return <ExpenseIcon />
      case "savings":
        return <SavingsIcon />
      default:
        return <ReceiptLongIcon />
    }
  }

  // Calculate daily totals
  const dailyTotals = {
    income: dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    expense: dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    savings: dayTransactions.filter((t) => t.type === "savings").reduce((sum, t) => sum + t.amount, 0),
    total: 0,
  }

  dailyTotals.total = dailyTotals.income - dailyTotals.expense - dailyTotals.savings

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay()
    // Adjust for Sunday as first day of week
    if (firstDayOfWeek === 0) firstDayOfWeek = 7

    const daysInMonth = lastDayOfMonth.getDate()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek - 1
    const prevMonth = subMonths(firstDayOfMonth, 1)
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate()

    // Calculate days from next month to show
    const totalDaysToShow = 42 // 6 rows of 7 days
    const daysFromNextMonth = totalDaysToShow - daysInMonth - daysFromPrevMonth

    const days = []

    // Add days from previous month
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i)
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
        transactions: getTransactionsForDate(date),
      })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
        transactions: getTransactionsForDate(date),
      })
    }

    // Add days from next month
    const nextMonth = addMonths(firstDayOfMonth, 1)
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i)
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
        transactions: getTransactionsForDate(date),
      })
    }

    return days
  }

  // Get transactions for a specific date
  const getTransactionsForDate = (date) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return isSameDay(transactionDate, date)
    })
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Go to today
  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDate(day.date)
  }

  // Get transaction indicators for a day
  const getTransactionIndicators = (transactions) => {
    const types = {}

    transactions.forEach((transaction) => {
      types[transaction.type] = true
    })

    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
        {types.income && <TransactionDot color={theme.palette.success.main} />}
        {types.expense && <TransactionDot color={theme.palette.error.main} />}
        {types.savings && <TransactionDot color={theme.palette.info.main} />}
      </Box>
    )
  }

  if (loading || !isAuthenticated) {
    return null
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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
              Expense Calendar
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track your daily expenses and income
            </Typography>
          </Box>

          {/* Update the Grid layout for better mobile responsiveness */}
          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr",
              },
              marginBottom: 3,
            }}
          >
            <Box>
              <CalendarContainer>
                <CalendarHeader>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mr: 2 }}>
                      {format(currentMonth, "MMMM yyyy")}
                    </Typography>
                    <CalendarNavigation>
                      <NavButton onClick={goToPreviousMonth} size="small">
                        <ChevronLeftIcon />
                      </NavButton>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={goToToday}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          minWidth: "auto",
                          px: 1,
                        }}
                      >
                        Today
                      </Button>
                      <NavButton onClick={goToNextMonth} size="small">
                        <ChevronRightIcon />
                      </NavButton>
                    </CalendarNavigation>
                  </Box>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Tooltip title="Add Transaction">
                      <AddButton onClick={() => setOpenTransactionDialog(true)} size="medium">
                        <AddIcon />
                      </AddButton>
                    </Tooltip>
                  </motion.div>
                </CalendarHeader>

                {/* Calendar Grid */}
                <CalendarGrid>
                  {/* Weekday headers */}
                  {weekDays.map((day) => (
                    <Box
                      key={day}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        p: 1,
                        textAlign: "center",
                        fontWeight: 600,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {day}
                    </Box>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day, index) => (
                    <CalendarDay
                      key={index}
                      isCurrentMonth={day.isCurrentMonth}
                      isSelected={day.isSelected}
                      isToday={day.isToday}
                      hasTransactions={day.transactions.length > 0}
                      onClick={() => handleDayClick(day)}
                    >
                      <DayNumber variant="body2" isToday={day.isToday}>
                        {day.dayNumber}
                      </DayNumber>

                      {day.transactions.length > 0 && (
                        <>
                          {getTransactionIndicators(day.transactions)}
                          {day.transactions.length > 0 && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                textAlign: "center",
                                mt: 0.5,
                                fontSize: "0.65rem",
                              }}
                            >
                              {day.transactions.length} {day.transactions.length === 1 ? "item" : "items"}
                            </Typography>
                          )}
                        </>
                      )}
                    </CalendarDay>
                  ))}
                </CalendarGrid>
              </CalendarContainer>
            </Box>
          </GridContainer>

          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr",
              },
              marginTop: 3,
            }}
          >
            <Box>
              <DayTransactionsContainer>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EventIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="600">
                      {format(selectedDate, "MMMM d, yyyy")}
                      {isToday(selectedDate) && (
                        <StyledChip
                          label="Today"
                          size="small"
                          color={theme.palette.primary.main}
                          sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FilterButton
                      id="filter-button"
                      aria-controls={openFilter ? "filter-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openFilter ? "true" : undefined}
                      onClick={handleFilterClick}
                      endIcon={<ArrowDropDownIcon />}
                      startIcon={<FilterListIcon />}
                      size="small"
                    >
                      {filter === "all"
                        ? "All"
                        : filter === "income"
                          ? "Income"
                          : filter === "expense"
                            ? "Expenses"
                            : "Savings"}
                    </FilterButton>
                    <Menu
                      id="filter-menu"
                      anchorEl={filterAnchorEl}
                      open={openFilter}
                      onClose={handleFilterClose}
                      MenuListProps={{
                        "aria-labelledby": "filter-button",
                      }}
                      PaperProps={{
                        elevation: 2,
                        sx: {
                          borderRadius: 3,
                          minWidth: 150,
                        },
                      }}
                    >
                      <MenuItem onClick={() => handleFilterChange("all")} selected={filter === "all"}>
                        All Transactions
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterChange("income")} selected={filter === "income"}>
                        <IncomeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                        Income
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterChange("expense")} selected={filter === "expense"}>
                        <ExpenseIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
                        Expenses
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterChange("savings")} selected={filter === "savings"}>
                        <SavingsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                        Savings
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>

                {/* Daily Summary */}
                {dayTransactions.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <GridContainer
                      sx={{
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },
                        gap: 2,
                      }}
                    >
                      <Box>
                        <SummaryCard type="income">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconContainer color={theme.palette.success.main}>
                              <IncomeIcon />
                            </IconContainer>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Income
                              </Typography>
                              <Typography variant="subtitle1" fontWeight="600">
                                {formatCurrency(dailyTotals.income)}
                              </Typography>
                            </Box>
                          </Box>
                        </SummaryCard>
                      </Box>
                      <Box>
                        <SummaryCard type="expense">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconContainer color={theme.palette.error.main}>
                              <ExpenseIcon />
                            </IconContainer>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Expenses
                              </Typography>
                              <Typography variant="subtitle1" fontWeight="600">
                                {formatCurrency(dailyTotals.expense)}
                              </Typography>
                            </Box>
                          </Box>
                        </SummaryCard>
                      </Box>
                    </GridContainer>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transactions
                  </Typography>
                  <StyledChip
                    icon={<ReceiptLongIcon fontSize="small" />}
                    label={`${dayTransactions.length} transactions`}
                    color={theme.palette.primary.main}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                {dayTransactions.length > 0 ? (
                  <List sx={{ flexGrow: 1, overflow: "auto", pr: 1 }}>
                    <AnimatePresence mode="wait">
                      {dayTransactions.map((transaction, index) => {
                        const typeColor = getTypeColor(transaction.type)
                        const typeIcon = getTypeIcon(transaction.type)

                        return (
                          <motion.div
                            key={transaction.id || `transaction-${index}`}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TransactionItem>
                              <Box sx={{ flexGrow: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: isMobile ? "flex-start" : "center",
                                    flexDirection: isMobile ? "column" : "row",
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", maxWidth: "70%" }}>
                                    <IconContainer color={typeColor} sx={{ width: 32, height: 32 }}>
                                      {typeIcon}
                                    </IconContainer>
                                    <ListItemText
                                      primary={
                                        <Tooltip title={transaction.description}>
                                          <Typography variant="body1" fontWeight="600" noWrap sx={{ maxWidth: "100%" }}>
                                            {transaction.description}
                                          </Typography>
                                        </Tooltip>
                                      }
                                      secondary={`${transaction.category} • ${format(
                                        new Date(transaction.date),
                                        "h:mm a",
                                      )}`}
                                      primaryTypographyProps={{
                                        fontWeight: "600",
                                        fontSize: isMobile ? "0.9rem" : "inherit",
                                        color: "text.primary",
                                      }}
                                      secondaryTypographyProps={{
                                        fontSize: isMobile ? "0.8rem" : "inherit",
                                        color: "text.secondary",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color={typeColor}
                                    fontWeight="600"
                                    sx={{
                                      ml: isMobile ? 0 : 2,
                                      mt: isMobile ? 1 : 0,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {transaction.type === "expense" ? "-" : "+"}
                                    {formatCurrency(transaction.amount)}
                                  </Typography>
                                </Box>
                              </Box>
                            </TransactionItem>
                            {index < dayTransactions.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </List>
                ) : (
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 3,
                    }}
                  >
                    <ReceiptLongIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" align="center">
                      No transactions for this day
                    </Typography>
                    <Typography variant="body2" color="text.disabled" align="center" sx={{ mt: 1, mb: 3 }}>
                      Click the + button to add a transaction
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<IncomeIcon />}
                        onClick={() => handleAddTransaction("income")}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Add Income
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<ExpenseIcon />}
                        onClick={() => handleAddTransaction("expense")}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Add Expense
                      </Button>
                    </Box>
                  </Box>
                )}
              </DayTransactionsContainer>
            </Box>
          </GridContainer>
        </motion.div>

        {openTransactionDialog && (
          <TransactionDialog
            open={openTransactionDialog}
            onClose={() => setOpenTransactionDialog(false)}
            type={transactionType}
            initialDate={selectedDate}
          />
        )}
      </Container>
    </DashboardLayout>
  )
}

