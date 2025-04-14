import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Test MongoDB connection
    const startTime = Date.now()

    const client = await clientPromise
    const db = client.db("dinarwise")

    // Simple ping to check connection
    await db.command({ ping: 1 })

    const connectionTime = Date.now() - startTime

    return NextResponse.json({
      status: "ok",
      message: "MongoDB connection successful",
      connectionTimeMs: connectionTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "MongoDB connection failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
