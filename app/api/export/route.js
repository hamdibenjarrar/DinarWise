import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import * as XLSX from "xlsx"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("dinarwise")

    // Get user transactions - handle both string and ObjectId formats
    const transactionsCollection = db.collection("transactions")

    // Try to find transactions with the userId as is (string format)
    let transactions = await transactionsCollection.find({ userId: userId }).sort({ date: -1 }).toArray()

    // If no transactions found and userId looks like an ObjectId, try with ObjectId
    if (transactions.length === 0 && userId.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        transactions = await transactionsCollection
          .find({ userId: new ObjectId(userId) })
          .sort({ date: -1 })
          .toArray()
      } catch (error) {
        console.error("Error converting to ObjectId:", error)
      }
    }

    // If still no transactions found, try with the user's email
    if (transactions.length === 0) {
      // Get the user from the database
      const usersCollection = db.collection("users")
      const user = await usersCollection.findOne({
        $or: [{ _id: userId.match(/^[0-9a-fA-F]{24}$/) ? new ObjectId(userId) : userId }, { email: userId }],
      })

      if (user) {
        // Try to find transactions with the user's ID
        transactions = await transactionsCollection.find({ userId: user._id.toString() }).sort({ date: -1 }).toArray()
      }
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()

    // Format transactions for Excel
    const formattedTransactions = transactions.map((transaction) => {
      const date = new Date(transaction.date).toISOString().split("T")[0]
      return {
        Date: date,
        Type: transaction.type,
        Amount: transaction.amount,
        Description: transaction.description,
        Category: transaction.category,
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

