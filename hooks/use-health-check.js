"use client"

import { useState, useEffect } from "react"

export function useHealthCheck() {
  const [status, setStatus] = useState("unknown")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch("/api/health")

        if (!response.ok) {
          throw new Error(`Health check failed with status: ${response.status}`)
        }

        const data = await response.json()
        setStatus(data.status)
        setError(null)
      } catch (err) {
        console.error("Health check error:", err)
        setStatus("error")
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return { status, loading, error }
}
