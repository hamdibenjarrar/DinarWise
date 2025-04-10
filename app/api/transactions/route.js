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

    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    const transactions = await transactionsCollection.find({ userId }).sort({ date: -1 }).toArray()

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST a new transaction
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, type, amount, description, category, date } = body

    // Validate input
    if (!userId || !type || !amount || !description || !category || !date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          receivedData: { userId, type, amount, description, category, date },
        },
        { status: 400 },
      )
    }

    const client = await clientPromise
    const db = client.db("dinarwise")
    const transactionsCollection = db.collection("transactions")

    const result = await transactionsCollection.insertOne({
      userId,
      type,
      amount: Number(amount),
      description,
      category,
      date: new Date(date),
      createdAt: new Date(),
    })

    if (!result.acknowledged) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to insert transaction into database",
        },
        { status: 500 },
      )
    }

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
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error: " + error.message,
      },
      { status: 500 },
    )
  }
}

