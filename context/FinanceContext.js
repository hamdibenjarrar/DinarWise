"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useSnackbar } from "notistack"
import { useAuth } from "./AuthContext"

// Create context
const FinanceContext = createContext()

// Sample data for initial state
const initialTransactions = [
  {
    id: "sample-income-1",
    type: "income",
    amount: 2500,
    description: "Monthly Salary",
    category: "Salary",
    date: new Date().toISOString(), // Today's date
  },
  {
    id: "sample-expense-1",
    type: "expense",
    amount: 500,
    description: "Monthly Rent",
    category: "Housing",
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
  },
  {
    id: "sample-expense-2",
    type: "expense",
    amount: 100,
    description: "Electricity Bill",
    category: "Utilities",
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 days ago
  },
  {
    id: "sample-expense-3",
    type: "expense",
    amount: 200,
    description: "Groceries",
    category: "Food",
    date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), // 7 days ago
  },
  {
    id: "sample-savings-1",
    type: "savings",
    amount: 300,
    description: "Emergency Fund",
    category: "Emergency Fund",
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), // 10 days ago
  },
]

// Finance provider component
export function FinanceProvider({ children }) {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar
  const [transactions, setTransactions] = useState([])
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [balance, setBalance] = useState(0)
  const [savings, setSavings] = useState(0)
  const [savingsGoal, setSavingsGoal] = useState(10000)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isUpdatingRef = useRef(false)
  const [categories, setCategories] = useState({
    income: ["Salary", "Freelance", "Investments", "Gifts", "Other"],
    expense: [
      "Food",
      "Housing",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Healthcare",
      "Education",
      "Shopping",
      "Other",
    ],
    savings: ["Emergency Fund", "Retirement", "Vacation", "Education", "Home", "Car", "Other"],
  })

  // Calculate totals from transactions
  const calculateTotals = useCallback((transactionList) => {
    let totalIncome = 0
    let totalExpenses = 0
    let totalSavings = 0

    transactionList.forEach((transaction) => {
      const amount = Number.parseFloat(transaction.amount) || 0

      if (transaction.type === "income") {
        totalIncome += amount
      } else if (transaction.type === "expense") {
        totalExpenses += amount
      } else if (transaction.type === "savings") {
        totalSavings += amount
      }
    })

    setIncome(totalIncome)
    setExpenses(totalExpenses)
    setSavings(totalSavings)
    setBalance(totalIncome - totalExpenses - totalSavings)
  }, [])

  // Fetch transactions from API when user is authenticated
  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/transactions?userId=${user.id}`)

      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`)
      }

      const data = await response.json()

      // Sort transactions by date (newest first)
      const sortedTransactions = data.transactions
        ? [...data.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
        : []

      setTransactions(sortedTransactions)

      // Calculate totals
      calculateTotals(sortedTransactions)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      setTransactions([])
      setError("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [user, calculateTotals])

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchTransactions()
    } else {
      setTransactions([])
      setIncome(0)
      setExpenses(0)
      setBalance(0)
      setSavings(0)
      setLoading(false)
    }
  }, [user, fetchTransactions])

  // Load savings goal from localStorage
  useEffect(() => {
    try {
      const storedSavingsGoal = localStorage.getItem("savingsGoal")
      if (storedSavingsGoal) {
        setSavingsGoal(Number.parseFloat(storedSavingsGoal))
      }
    } catch (error) {
      console.error("Error loading savings goal:", error)
    }
  }, [])

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    if (!user?.id) return { success: false, error: "User not authenticated" }

    try {
      // For development, create a unique ID for the transaction
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      // Add the transaction to the local state first for immediate feedback
      const newTransaction = {
        id: tempId,
        ...transactionData,
        userId: user.id,
      }

      // Update local state with the new transaction
      setTransactions((prev) => [newTransaction, ...prev])

      // Update totals based on transaction type
      if (transactionData.type === "income") {
        setIncome((prev) => prev + Number(transactionData.amount))
        setBalance((prev) => prev + Number(transactionData.amount))
      } else if (transactionData.type === "expense") {
        setExpenses((prev) => prev + Number(transactionData.amount))
        setBalance((prev) => prev - Number(transactionData.amount))
      } else if (transactionData.type === "savings") {
        setSavings((prev) => prev + Number(transactionData.amount))
        setBalance((prev) => prev - Number(transactionData.amount))
      }

      // Now send to API
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Revert the local changes if API call fails
        await fetchTransactions()
        throw new Error(data.error || `Error adding transaction: ${response.statusText}`)
      }

      return { success: true }
    } catch (error) {
      console.error("Failed to add transaction:", error)
      return { success: false, error: error.message }
    }
  }

  // Update an existing transaction
  const updateTransaction = async (transactionId, transactionData) => {
    if (!user?.id) return { success: false, error: "User not authenticated" }

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error updating transaction: ${response.statusText}`)
      }

      // Refresh transactions
      await fetchTransactions()
      return { success: true }
    } catch (error) {
      console.error("Failed to update transaction:", error)
      return { success: false, error: error.message }
    }
  }

  // Delete a transaction
  const deleteTransaction = async (transactionId) => {
    if (!user?.id) return false

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error deleting transaction: ${response.statusText}`)
      }

      // Refresh transactions
      await fetchTransactions()
      return true
    } catch (error) {
      console.error("Failed to delete transaction:", error)
      return false
    }
  }

  // Add savings goal
  const addSavingsGoal = useCallback((amount) => {
    try {
      const numAmount = Number(amount) || 10000
      setSavingsGoal(numAmount)
      localStorage.setItem("savingsGoal", numAmount.toString())
      return { success: true }
    } catch (error) {
      console.error("Error saving goal:", error)
      return { success: false, error: error.message }
    }
  }, [])

  // Reset all data - improved with better error handling
  const resetData = async () => {
    if (!user?.id) return false

    try {
      console.log("Resetting data for user:", user.id)

      // Call the API endpoint to delete all transactions
      const response = await fetch(`/api/user/reset-data?userId=${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Reset response status:", response.status)

      // If response is not OK, try to get the error message
      if (!response.ok) {
        let errorMessage = response.statusText
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If we can't parse JSON, try to get text
          try {
            errorMessage = await response.text()
          } catch (textError) {
            // If all else fails, use the status text
            console.error("Could not parse error response:", textError)
          }
        }
        throw new Error(`Error resetting data: ${errorMessage}`)
      }

      const result = await response.json()
      console.log("Reset result:", result)

      // Reset local state after successful API call
      setTransactions([])
      setIncome(0)
      setExpenses(0)
      setBalance(0)
      setSavings(0)

      return true
    } catch (error) {
      console.error("Failed to reset data:", error)
      return false
    }
  }

  // Refresh transactions
  const refreshTransactions = async () => {
    await fetchTransactions()
    return true
  }

  // Add this test function to check if the API is working
  const testResetEndpoint = async () => {
    if (!user?.id) return { success: false, error: "No user ID" }

    try {
      const response = await fetch(`/api/reset?userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Test reset error:", errorText)
        return { success: false, error: errorText }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Test reset error:", error)
      return { success: false, error: error.message }
    }
  }

  // Update the context value to include resetData
  const value = {
    transactions,
    income,
    expenses,
    balance,
    savings,
    savingsGoal,
    loading,
    error,
    categories,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addSavingsGoal,
    resetData,
    refreshTransactions,
    testResetEndpoint, // Add this line
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

// Custom hook to use finance context
export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

