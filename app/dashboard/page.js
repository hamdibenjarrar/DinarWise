"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useFinance } from "@/context/FinanceContext"
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/system"
import DashboardLayout from "@/components/DashboardLayout"
import BalanceCard from "@/components/dashboard/BalanceCard"
import ExpensesByCategoryChart from "@/components/dashboard/ExpensesByCategoryChart"
import RecentTransactions from "@/components/dashboard/RecentTransactions"
import SavingsProgress from "@/components/dashboard/SavingsProgress"
import MonthlyOverview from "@/components/dashboard/MonthlyOverview"
import AddTransactionButton from "@/components/dashboard/AddTransactionButton"
import TransactionDialog from "@/components/dashboard/TransactionDialog"
import FinancialTips from "@/components/dashboard/FinancialTips"
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart"
import { Refresh as RefreshIcon } from "@mui/icons-material"

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
}))

const WelcomeText = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}))

const SubtitleText = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
}))

const DashboardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background:
    theme.palette.mode === "light"
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))"
      : "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8))",
  backdropFilter: "blur(10px)",
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
    boxShadow:
      theme.palette.mode === "light"
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  },
}))

// Create a Grid component that doesn't use the deprecated props
const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(3),
  width: "100%",
}))

export default function Dashboard() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { isAuthenticated, loading, user } = useAuth()
  const { transactions, income, expenses, balance, savings, deleteTransaction, refreshTransactions } = useFinance()
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false)
  const [transactionType, setTransactionType] = useState("expense")
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Define these handlers with useCallback to prevent unnecessary re-renders
  const handleAddIncome = useCallback(() => {
    console.log("Add Income clicked")
    setTransactionType("income")
    setOpenTransactionDialog(true)
  }, [])

  const handleAddExpense = useCallback(() => {
    console.log("Add Expense clicked")
    setTransactionType("expense")
    setOpenTransactionDialog(true)
  }, [])

  const handleAddSavings = useCallback(() => {
    console.log("Add Savings clicked")
    setTransactionType("savings")
    setOpenTransactionDialog(true)
  }, [])

  const handleEditTransaction = useCallback((transaction) => {
    setTransactionType(transaction.type)
    setEditingTransaction(transaction)
    setOpenTransactionDialog(true)
  }, [])

  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        await deleteTransaction(transactionId)
        setSnackbar({
          open: true,
          message: "Transaction deleted successfully",
          severity: "success",
        })
      }
    },
    [deleteTransaction],
  )

  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshTransactions()
      setSnackbar({
        open: true,
        message: "Data refreshed successfully",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to refresh data",
        severity: "error",
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshTransactions])

  const handleCloseDialog = useCallback(() => {
    setOpenTransactionDialog(false)
    setEditingTransaction(null)
  }, [])

  const handleTransactionSuccess = useCallback((message) => {
    setSnackbar({
      open: true,
      message,
      severity: "success",
    })
  }, [])

  if (loading || !isAuthenticated) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  // Get current date for greeting
  const currentHour = new Date().getHours()
  let greeting = "Good evening"
  if (currentHour < 12) {
    greeting = "Good morning"
  } else if (currentHour < 18) {
    greeting = "Good afternoon"
  }

  // Hide email address in the UI
  const firstName = user?.name?.split(" ")[0] || "User"

  return (
    <DashboardLayout>
      <PageContainer maxWidth="xl">
        <Box>
          <DashboardHeader>
            <Box>
              <WelcomeText>
                {greeting}, {firstName}!
              </WelcomeText>
              <SubtitleText>Here's an overview of your financial health</SubtitleText>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handleRefreshData}
                disabled={isRefreshing}
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "background.paper", opacity: 0.9 },
                }}
              >
                {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Box>
          </DashboardHeader>

          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                md: "5fr 7fr",
                lg: "4fr 8fr",
              },
              marginBottom: 4,
            }}
          >
            {/* Top row with Balance Summary and Recent Transactions */}
            <Box>
              <BalanceCard
                balance={balance}
                income={income}
                expenses={expenses}
                savings={savings}
                onAddIncome={handleAddIncome}
                onAddExpense={handleAddExpense}
                onAddSavings={handleAddSavings}
              />
            </Box>

            <Box>
              <RecentTransactions
                transactions={transactions}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </Box>
          </GridContainer>

          {/* Charts Row */}
          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                md: "8fr 4fr",
              },
              marginBottom: 3,
            }}
          >
            <Box>
              <StyledPaper>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Income & Expense Trends
                </Typography>
                <Box sx={{ height: { xs: 250, sm: 350 } }}>
                  <IncomeExpenseChart />
                </Box>
              </StyledPaper>
            </Box>

            <Box>
              <SavingsProgress />
            </Box>
          </GridContainer>

          {/* Monthly Overview and Expenses by Category */}
          <GridContainer
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              marginBottom: 3,
            }}
          >
            <Box>
              <MonthlyOverview />
            </Box>

            <Box>
              <ExpensesByCategoryChart />
            </Box>
          </GridContainer>

          {/* Financial Tips */}
          <Box>
            <FinancialTips />
          </Box>
        </Box>

        <AddTransactionButton
          onAddIncome={handleAddIncome}
          onAddExpense={handleAddExpense}
          onAddSavings={handleAddSavings}
        />

        {openTransactionDialog && (
          <TransactionDialog
            open={openTransactionDialog}
            onClose={handleCloseDialog}
            type={transactionType}
            transaction={editingTransaction}
            onSuccess={handleTransactionSuccess}
          />
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PageContainer>
    </DashboardLayout>
  )
}

