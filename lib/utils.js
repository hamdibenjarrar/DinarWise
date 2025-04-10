import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format currency in Tunisian Dinar (DT)
export const formatCurrency = (amount) => {
  const formattedAmount = new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${formattedAmount} DT`
}

// Format percentage
export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`
}

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-TN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

