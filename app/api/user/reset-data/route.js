import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    // Delete all transactions for the user
    const result = await transactionsCollection.deleteMany({ userId })

    return NextResponse.json({
      success: true,
      message: "Data reset successfully",
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error resetting data:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}

