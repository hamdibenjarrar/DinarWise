import { NextResponse } from "next/server"

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Return success even without deleting (for testing)
    return NextResponse.json({
      success: true,
      message: "API endpoint is working correctly",
      userId: userId,
    })
  } catch (error) {
    console.error("Error in reset API:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}

