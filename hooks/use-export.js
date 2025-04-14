"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { downloadFile } from "@/utils/api"

export function useExport() {
  const { data: session } = useSession()
  const [exporting, setExporting] = useState(false)

  const exportData = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to export data")
      return
    }

    setExporting(true)
    try {
      const userId = session.user.id
      toast.loading("Preparing your export...", { id: "export" })

      // Use direct download approach
      await downloadFile(`/api/export?userId=${userId}`, "dinarwise-export.xlsx")

      toast.success("Export completed", { id: "export" })
    } catch (error) {
      console.error("Export error:", error)
      toast.error(`Export failed: ${error.message}`, { id: "export" })
    } finally {
      setExporting(false)
    }
  }

  return { exportData, exporting }
}
