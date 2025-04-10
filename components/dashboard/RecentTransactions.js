"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
  Avatar,
} from "@mui/material"
import { styled } from "@mui/system"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { formatCurrency } from "@/utils/formatters"
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Savings as SavingsIcon,
  ShoppingBag as ShoppingIcon,
  Home as HomeIcon,
  LocalHospital as HealthcareIcon,
  School as EducationIcon,
  DirectionsCar as TransportIcon,
  Fastfood as FoodIcon,
  Devices as EntertainmentIcon,
  Work as WorkIcon,
} from "@mui/icons-material"

const TransactionsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: theme.palette.mode === "light" ? "#fff" : "#1e1e1e",
}))

const TransactionItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  borderRadius: 16,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
    transform: "translateX(5px)",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    "& > .MuiBox-root:last-child": {
      marginTop: theme.spacing(1),
      alignSelf: "flex-end",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
    },
  },
}))

const DateHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

const DateText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}))

const DateDivider = styled(Divider)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(1),
}))

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  textAlign: "center",
}))

// Function to get icon based on transaction category
const getCategoryIcon = (category, type) => {
  const lowerCategory = category.toLowerCase()

  if (type === "income") return <IncomeIcon />
  if (type === "savings") return <SavingsIcon />

  if (lowerCategory.includes("food") || lowerCategory.includes("grocery")) return <FoodIcon />
  if (lowerCategory.includes("transport")) return <TransportIcon />
  if (lowerCategory.includes("house") || lowerCategory.includes("rent") || lowerCategory.includes("home"))
    return <HomeIcon />
  if (lowerCategory.includes("health")) return <HealthcareIcon />
  if (lowerCategory.includes("education")) return <EducationIcon />
  if (lowerCategory.includes("entertainment")) return <EntertainmentIcon />
  if (lowerCategory.includes("shopping")) return <ShoppingIcon />
  if (lowerCategory.includes("salary") || lowerCategory.includes("work") || lowerCategory.includes("business"))
    return <WorkIcon />

  // Default icon based on type
  if (type === "expense") return <ExpenseIcon />

  return <ReceiptIcon />
}

// Function to get color based on transaction type
const getTypeColor = (type, theme) => {
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

export default function RecentTransactions({ transactions, onEditTransaction, onDeleteTransaction }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [displayCount, setDisplayCount] = useState(5)

  const handleMenuOpen = (event, transaction) => {
    setAnchorEl(event.currentTarget)
    setSelectedTransaction(transaction)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTransaction(null)
  }

  const handleEdit = () => {
    onEditTransaction(selectedTransaction)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDeleteTransaction(selectedTransaction.id)
    handleMenuClose()
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Get the transactions to display based on current count
  const displayedTransactions = sortedTransactions.slice(0, displayCount)

  // Group transactions by date
  const groupedTransactions = displayedTransactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), "yyyy-MM-dd")
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})

  // Function to format date for display
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return format(date, "EEEE, MMMM d")
    }
  }

  return (
    <TransactionsContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Recent Transactions
        </Typography>
        {sortedTransactions.length > displayCount && (
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setDisplayCount((prev) => prev + 5)}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            View All
          </Button>
        )}
      </Box>

      {Object.keys(groupedTransactions).length > 0 ? (
        <Box sx={{ maxHeight: isMobile ? 350 : 450, overflow: "auto", pr: 1 }}>
          <AnimatePresence>
            {Object.entries(groupedTransactions).map(([date, dateTransactions], groupIndex) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
              >
                <DateHeader>
                  <DateText>{formatDateHeader(date)}</DateText>
                  <DateDivider />
                </DateHeader>

                {dateTransactions.map((transaction, index) => {
                  const typeColor = getTypeColor(transaction.type, theme)
                  const categoryIcon = getCategoryIcon(transaction.category, transaction.type)
                  const isIncome = transaction.type === "income" || transaction.type === "savings"

                  return (
                    <motion.div
                      key={transaction.id || `transaction-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ x: 10, opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TransactionItem>
                        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                          <Avatar
                            sx={{
                              bgcolor: `${typeColor}15`,
                              color: typeColor,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {categoryIcon}
                          </Avatar>
                          <Box sx={{ ml: 1.5, overflow: "hidden" }}>
                            <Tooltip title={transaction.description}>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                noWrap
                                sx={{ maxWidth: { xs: 150, sm: 200, md: 250 } }}
                              >
                                {transaction.description}
                              </Typography>
                            </Tooltip>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.category} • {format(new Date(transaction.date), "h:mm a")}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              color:
                                transaction.type === "expense" ? theme.palette.error.main : theme.palette.success.main,
                            }}
                          >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </Typography>

                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, transaction)} sx={{ ml: 1 }}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TransactionItem>
                      {index < dateTransactions.length - 1 && <Divider sx={{ my: 1, opacity: 0.6 }} />}
                    </motion.div>
                  )
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      ) : (
        <EmptyState>
          <ReceiptIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No transactions yet
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Add your first transaction to see it here
          </Typography>
        </EmptyState>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </TransactionsContainer>
  )
}

