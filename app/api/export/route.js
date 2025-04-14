import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import * as XLSX from "xlsx"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Simplified MongoDB connection and query
    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    // Basic query with limit
    const transactions = await transactionsCollection.find({ userId }).limit(500).sort({ date: -1 }).toArray()

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()

    // Format transactions for Excel
    const formattedTransactions = transactions.map((transaction) => {
      const date = transaction.date ? new Date(transaction.date).toISOString().split("T")[0] : ""
      return {
        Date: date,
        Type: transaction.type || "",
        Amount: transaction.amount || 0,
        Description: transaction.description || "",
        Category: transaction.category || "",
      }
    })

    // Create worksheet from transactions
    const worksheet = XLSX.utils.json_to_sheet(formattedTransactions)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions")

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Return Excel file as download
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=dinarwise-export.xlsx",
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}
