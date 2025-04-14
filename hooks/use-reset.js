"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { fetchAPI } from "@/utils/api"

export function useReset() {
  const { data: session } = useSession()
  const [resetting, setResetting] = useState(false)

  const resetData = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to reset data")
      return
    }

    // Confirm before resetting
    if (!confirm("Are you sure you want to reset all your data? This cannot be undone.")) {
      return
    }

    setResetting(true)
    try {
      const userId = session.user.id
      toast.loading("Resetting your data...", { id: "reset" })

      const data = await fetchAPI(`/api/reset-data?userId=${userId}`, {
        method: "DELETE",
      })

      toast.success(`Data reset successfully. Deleted ${data.deletedCount} transactions.`, { id: "reset" })
      return data
    } catch (error) {
      console.error("Failed to reset data:", error)
      toast.error(`Failed to reset data: ${error.message}`, { id: "reset" })
      throw error
    } finally {
      setResetting(false)
    }
  }

  return { resetData, resetting }
}
