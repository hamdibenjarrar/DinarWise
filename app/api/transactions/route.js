import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET all transactions for a user
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

    // Basic query with minimal fields and limit
    const transactions = await transactionsCollection.find({ userId }).limit(50).sort({ date: -1 }).toArray()

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}

// POST a new transaction
export async function POST(request) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { userId, type, amount, description, category, date } = body

    // Validate input
    if (!userId || !type || !amount) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          receivedData: { userId, type, amount },
        },
        { status: 400 },
      )
    }

    // Simplified MongoDB connection and insert
    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    const result = await transactionsCollection.insertOne({
      userId,
      type,
      amount: Number(amount),
      description: description || "",
      category: category || "Other",
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Transaction added successfully",
        transactionId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding transaction:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}
