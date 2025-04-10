"use client"

import { useState, useEffect } from "react"
import { useFinance } from "@/context/FinanceContext"
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  Chip,
} from "@mui/material"
import { styled } from "@mui/system"
import { formatCurrency } from "@/utils/formatters"
import {
  Edit,
  Close as CloseIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"

const BudgetContainer = styled(Paper)(({ theme }) => ({
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

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}))

const StyledLinearProgress = styled(LinearProgress)(
  ({ theme, colorname = "secondary", value }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
    "& .MuiLinearProgress-bar": {
      borderRadius: 4,
      background:
        value > 100
          ? `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`
          : `linear-gradient(90deg, ${theme.palette[colorname].main}, ${theme.palette[colorname].light})`,
    },
  }),
  {
    shouldForwardProp: (prop) => prop !== "colorname" && prop !== "value",
  },
)

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "6px 16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease",
  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  color: theme.palette.common.white,
  "&:hover": {
    background: `linear-gradient(90deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.dark})`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${theme.palette.secondary.main}40`,
  },
}))

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    boxShadow:
      theme.palette.mode === "light" ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
}))

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3),
  background:
    theme.palette.mode === "light"
      ? `linear-gradient(135deg, ${theme.palette.secondary.light}20, ${theme.palette.secondary.main}40)`
      : `linear-gradient(135deg, ${theme.palette.secondary.main}40, ${theme.palette.secondary.dark}60)`,
  color: theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.common.white,
  fontWeight: 600,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

const BudgetItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 12,
  marginBottom: theme.spacing(1.5),
  backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.05)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
    transform: "translateX(5px)",
  },
}))

// Default budget categories
const DEFAULT_BUDGET_CATEGORIES = [
  { name: "Housing", amount: 1000, color: "#4F46E5" },
  { name: "Food", amount: 500, color: "#10B981" },
  { name: "Transportation", amount: 300, color: "#F59E0B" },
  { name: "Utilities", amount: 200, color: "#3B82F6" },
  { name: "Entertainment", amount: 150, color: "#EF4444" },
]

export default function BudgetPlanner() {
  const theme = useTheme()
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const { transactions } = useFinance()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)
  const [budgetCategories, setBudgetCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: "", amount: "", color: "#4F46E5" })
  const [categorySpending, setCategorySpending] = useState({})

  // Load budget categories from localStorage or use defaults
  useEffect(() => {
    const storedBudget = localStorage.getItem("budgetCategories")
    if (storedBudget) {
      setBudgetCategories(JSON.parse(storedBudget))
    } else {
      setBudgetCategories(DEFAULT_BUDGET_CATEGORIES)
      localStorage.setItem("budgetCategories", JSON.stringify(DEFAULT_BUDGET_CATEGORIES))
    }
  }, [])

  // Calculate spending by category
  useEffect(() => {
    if (transactions.length > 0 && budgetCategories.length > 0) {
      // Get current month's expenses
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const monthExpenses = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return (
          transaction.type === "expense" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })

      // Calculate spending by category
      const spending = {}

      // Initialize all budget categories with zero spending
      budgetCategories.forEach((category) => {
        spending[category.name] = 0
      })

      // Sum up expenses by category
      monthExpenses.forEach((expense) => {
        // Try to match expense category with budget category
        const matchingCategory = budgetCategories.find(
          (category) => category.name.toLowerCase() === expense.category.toLowerCase(),
        )

        if (matchingCategory) {
          spending[matchingCategory.name] += expense.amount
        } else {
          // For expenses that don't match any budget category
          if (!spending["Other"]) {
            spending["Other"] = 0
          }
          spending["Other"] += expense.amount
        }
      })

      setCategorySpending(spending)
    }
  }, [transactions, budgetCategories])

  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Editing existing category
      setNewCategory(budgetCategories[index])
      setEditingIndex(index)
    } else {
      // Adding new category
      setNewCategory({ name: "", amount: "", color: "#4F46E5" })
      setEditingIndex(-1)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSaveCategory = () => {
    if (!newCategory.name || !newCategory.amount) return

    const updatedCategories = [...budgetCategories]

    if (editingIndex >= 0) {
      // Update existing category
      updatedCategories[editingIndex] = newCategory
    } else {
      // Add new category
      updatedCategories.push(newCategory)
    }

    setBudgetCategories(updatedCategories)
    localStorage.setItem("budgetCategories", JSON.stringify(updatedCategories))
    handleCloseDialog()
  }

  const handleDeleteCategory = (index) => {
    const updatedCategories = budgetCategories.filter((_, i) => i !== index)
    setBudgetCategories(updatedCategories)
    localStorage.setItem("budgetCategories", JSON.stringify(updatedCategories))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }))
  }

  // Calculate total budget and spending
  const totalBudget = budgetCategories.reduce((sum, category) => sum + category.amount, 0)
  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + Number(amount), 0)
  const budgetProgress = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0

  return (
    <BudgetContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BarChartIcon
            sx={{
              color: theme.palette.secondary.main,
              mr: 1,
              filter: `drop-shadow(0 2px 4px ${theme.palette.secondary.main}40)`,
            }}
          />
          <Typography variant="h6" component="div" fontWeight="600">
            Monthly Budget
          </Typography>
        </Box>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StyledButton startIcon={<AddIcon />} size="small" onClick={() => handleOpenDialog()}>
            Add Category
          </StyledButton>
        </motion.div>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Total Budget
          </Typography>
          <Typography variant="subtitle1" fontWeight="600">
            {formatCurrency(totalBudget)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Total Spent
          </Typography>
          <Typography variant="subtitle1" fontWeight="600" color={budgetProgress > 100 ? "error.main" : "text.primary"}>
            {formatCurrency(totalSpending)}
          </Typography>
        </Box>

        <ProgressContainer>
          <StyledLinearProgress
            variant="determinate"
            value={Math.min(budgetProgress, 100)}
            colorname={budgetProgress > 100 ? "error" : "secondary"}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {budgetProgress.toFixed(0)}% of budget used
            </Typography>
            <Typography
              variant="caption"
              color={budgetProgress > 100 ? "error.main" : "text.secondary"}
              fontWeight={500}
            >
              {budgetProgress > 100 ? "Over budget!" : `${formatCurrency(totalBudget - totalSpending)} remaining`}
            </Typography>
          </Box>
        </ProgressContainer>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Budget Categories
      </Typography>

      <Box sx={{ maxHeight: 300, overflow: "auto", pr: 1 }}>
        {budgetCategories.map((category, index) => {
          const spent = categorySpending[category.name] || 0
          const progress = category.amount > 0 ? (spent / category.amount) * 100 : 0

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <BudgetItem>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: category.color,
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" fontWeight="600">
                      {category.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton size="small" onClick={() => handleOpenDialog(index)} sx={{ mr: 0.5 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteCategory(index)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(spent)} of {formatCurrency(category.amount)}
                  </Typography>
                  {progress > 100 ? (
                    <Chip
                      icon={<WarningIcon fontSize="small" />}
                      label="Over budget"
                      size="small"
                      color="error"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  ) : progress > 80 ? (
                    <Chip label="Almost full" size="small" color="warning" sx={{ height: 20, fontSize: "0.7rem" }} />
                  ) : (
                    <Chip
                      icon={<CheckCircleIcon fontSize="small" />}
                      label="On track"
                      size="small"
                      color="success"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  )}
                </Box>

                <StyledLinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  colorname={progress > 100 ? "error" : progress > 80 ? "warning" : "success"}
                />
              </BudgetItem>
            </motion.div>
          )
        })}

        {budgetCategories.length === 0 && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No budget categories yet. Add your first category to start tracking.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add/Edit Category Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogHeader>
          <Typography variant="h6" component="div" fontWeight={600}>
            {editingIndex >= 0 ? "Edit Category" : "Add Category"}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory.name}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Budget Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newCategory.amount}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">TND</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              fontWeight: 500,
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <StyledButton onClick={handleSaveCategory} variant="contained">
              {editingIndex >= 0 ? "Update" : "Add"}
            </StyledButton>
          </motion.div>
        </DialogActions>
      </StyledDialog>
    </BudgetContainer>
  )
}

