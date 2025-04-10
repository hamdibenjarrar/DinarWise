"use client"

import { useState, useEffect, useRef } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  IconButton,
  Box,
  Typography,
} from "@mui/material"
import { styled } from "@mui/system"
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material"
import { useFinance } from "@/context/FinanceContext"
import { DatePicker } from "@mui/x-date-pickers"
import { motion } from "framer-motion"
import dayjs from "dayjs"

const StyledButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 12,
  padding: "8px 20px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease",
  background: color || theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    background: color ? color : theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${color ? color + "40" : theme.palette.primary.main + "40"}`,
  },
}))

// Define categories based on transaction type
const getCategories = (type) => {
  switch (type) {
    case "income":
      return ["Salary", "Freelance", "Business", "Investments", "Gifts", "Rental Income", "Other Income"]
    case "expense":
      return [
        "Food",
        "Transportation",
        "Housing",
        "Utilities",
        "Entertainment",
        "Healthcare",
        "Education",
        "Shopping",
        "Travel",
        "Other",
      ]
    case "savings":
      return [
        "Emergency Fund",
        "Retirement",
        "Education",
        "Home Purchase",
        "Vehicle Purchase",
        "Travel Fund",
        "Investment",
        "Other Savings",
      ]
    default:
      return ["Other"]
  }
}

// Get color based on transaction type
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

export default function TransactionDialog({ open, onClose, type, transaction, onSuccess, initialDate }) {
  const theme = useTheme()
  const { addTransaction, updateTransaction } = useFinance()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(dayjs(initialDate || new Date()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isInitializedRef = useRef(false)
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState("")

  // Get categories based on transaction type
  const transactionType = type || transaction?.type || "expense"
  const categories = getCategories(transactionType)
  const typeColor = getTypeColor(transactionType, theme)

  // Initialize form values only once when component mounts or transaction changes
  useEffect(() => {
    if (!isInitializedRef.current && open) {
      if (transaction) {
        setAmount(transaction.amount || "")
        setDescription(transaction.description || "")
        setCategory(transaction.category || categories[0])
        setDate(dayjs(transaction.date || new Date()))
      } else {
        setAmount("")
        setDescription("")
        setCategory(categories[0])
        setDate(dayjs(initialDate || new Date()))
      }
      isInitializedRef.current = true
    }
  }, [transaction, initialDate, categories, open])

  // Reset initialized state when dialog closes
  useEffect(() => {
    if (!open) {
      isInitializedRef.current = false
    }
  }, [open])

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory(value)
    setIsCustomCategory(value === "Other" || value === "Other Income" || value === "Other Savings")
  }

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value)
  }

  const handleDateChange = (newDate) => {
    setDate(newDate)
  }

  const validateForm = () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount")
      return false
    }
    if (!description.trim()) {
      setError("Please enter a description")
      return false
    }
    if (!category) {
      setError("Please select a category")
      return false
    }
    if (isCustomCategory && !customCategory.trim()) {
      setError("Please enter a custom category")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const transactionData = {
        type: transactionType,
        amount: Number(amount),
        description,
        category: isCustomCategory ? customCategory : category,
        date: date.toISOString(),
      }

      if (transaction) {
        // Update existing transaction
        const result = await updateTransaction(transaction.id, transactionData)
        if (result.success) {
          onClose()
          if (onSuccess) {
            onSuccess("Transaction updated successfully")
          }
        } else {
          setError(result.error || "Failed to update transaction")
        }
      } else {
        // Add new transaction
        const result = await addTransaction(transactionData)
        if (result.success) {
          onClose()
          if (onSuccess) {
            onSuccess("Transaction added successfully")
          }
        } else {
          setError(result.error || "Failed to add transaction")
        }
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      setError("Failed to save transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getDialogTitle = () => {
    if (transaction) {
      return `Edit ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`
    }
    return `Add ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          overflow: "visible",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: `${typeColor}20`,
          color: typeColor,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {getDialogTitle()}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 1 }}>
        {error && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "error.main",
              color: "white",
              borderRadius: 2,
              fontSize: "0.875rem",
            }}
          >
            {error}
          </Box>
        )}

        <TextField
          autoFocus
          margin="normal"
          id="amount"
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={handleAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">TND</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <MoneyIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          id="description"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <DescriptionIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
            {!categories.includes("Other") && transactionType === "expense" && <MenuItem value="Other">Other</MenuItem>}
            {!categories.includes("Other Income") && transactionType === "income" && (
              <MenuItem value="Other Income">Other Income</MenuItem>
            )}
            {!categories.includes("Other Savings") && transactionType === "savings" && (
              <MenuItem value="Other Savings">Other Savings</MenuItem>
            )}
          </Select>
        </FormControl>

        {isCustomCategory && (
          <TextField
            margin="normal"
            id="customCategory"
            label="Enter Custom Category"
            type="text"
            fullWidth
            value={customCategory}
            onChange={handleCustomCategoryChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CategoryIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}

        <DatePicker
          label="Date"
          value={date}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                ),
              },
            },
          }}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            fontWeight: 500,
            borderRadius: 8,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StyledButton onClick={handleSubmit} color={typeColor} disabled={loading}>
            {loading ? "Saving..." : transaction ? "Update" : "Add"}
          </StyledButton>
        </motion.div>
      </DialogActions>
    </Dialog>
  )
}

