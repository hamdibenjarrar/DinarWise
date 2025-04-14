"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { fetchAPI } from "@/utils/api"

export function useTransactions() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    if (!session?.user?.id) return

    setLoading(true)
    setError(null)

    try {
      const userId = session.user.id
      const data = await fetchAPI(`/api/transactions?userId=${userId}`)
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
      setError(err.message)
      toast.error(`Failed to load transactions: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [session])

  const addTransaction = async (transactionData) => {
    if (!session?.user?.id) return

    try {
      const result = await fetchAPI("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          ...transactionData,
          userId: session.user.id,
        }),
      })

      toast.success("Transaction added successfully")
      await fetchTransactions() // Refresh the list
      return result
    } catch (err) {
      console.error("Failed to add transaction:", err)
      toast.error(`Failed to add transaction: ${err.message}`)
      throw err
    }
  }

  const deleteTransaction = async (id) => {
    if (!session?.user?.id) return

    try {
      const result = await fetchAPI(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      toast.success("Transaction deleted successfully")
      await fetchTransactions() // Refresh the list
      return result
    } catch (err) {
      console.error("Failed to delete transaction:", err)
      toast.error(`Failed to delete transaction: ${err.message}`)
      throw err
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchTransactions()
    }
  }, [session, fetchTransactions])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
  }
}
