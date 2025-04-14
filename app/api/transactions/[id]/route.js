import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a specific transaction
export async function GET(request, { params }) {
  try {
    const { id } = params

    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    const transaction = await transactionsCollection.findOne({ _id: new ObjectId(id) })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}

// DELETE a transaction
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    const result = await transactionsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}
