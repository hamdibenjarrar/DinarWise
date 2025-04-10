"use client"

import { Box, Paper, Typography, useTheme, useMediaQuery, Button } from "@mui/material"
import { styled } from "@mui/system"
import { formatCurrency } from "@/utils/formatters"
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Savings as SavingsIcon,
  Add as AddIcon,
} from "@mui/icons-material"

const BalanceContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  height: "100%",
  position: "relative",
  overflow: "visible", // Changed from hidden to visible
  background:
    theme.palette.mode === "light"
      ? "linear-gradient(135deg, #5C2AD2, #7B4DE3)"
      : "linear-gradient(135deg, #4A1CA8, #6C3FD0)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}))

const BalanceHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: theme.spacing(3),
}))

const BalanceAmount = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  marginTop: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}))

const CategoryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  borderRadius: 16,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  marginBottom: theme.spacing(1.5),
  backdropFilter: "blur(10px)",
  transition: "all 0.2s ease",
  position: "relative", // Add position relative
  zIndex: 5, // Add z-index
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(-2px)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}))

const IconContainer = styled(Box)(({ theme, bgcolor }) => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: bgcolor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 4px 8px ${bgcolor}80`,
}))

const AddButton = styled(Button)(({ theme, bgcolor }) => ({
  minWidth: 32,
  width: 32,
  height: 32,
  borderRadius: "50%",
  padding: 0,
  backgroundColor: bgcolor,
  color: "#fff",
  zIndex: 10, // Add z-index to ensure it's clickable
  position: "relative", // Ensure proper stacking
  "&:hover": {
    backgroundColor: bgcolor,
    opacity: 0.9,
  },
}))

export default function BalanceCard({ balance, income, expenses, savings, onAddIncome, onAddExpense, onAddSavings }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <BalanceContainer>
      <BalanceHeader>
        <Typography variant="subtitle2" fontWeight={500} sx={{ opacity: 0.8 }}>
          Current Balance
        </Typography>
        <BalanceAmount>{formatCurrency(balance)}</BalanceAmount>
      </BalanceHeader>

      <CategoryItem>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconContainer bgcolor="#4CAF50">
            <IncomeIcon />
          </IconContainer>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Income
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(income)}
            </Typography>
          </Box>
        </Box>
        <AddButton bgcolor="#4CAF50" onClick={onAddIncome} aria-label="Add Income">
          <AddIcon fontSize="small" />
        </AddButton>
      </CategoryItem>

      <CategoryItem>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconContainer bgcolor="#FF4A5E">
            <ExpenseIcon />
          </IconContainer>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Expenses
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(expenses)}
            </Typography>
          </Box>
        </Box>
        <AddButton bgcolor="#FF4A5E" onClick={onAddExpense} aria-label="Add Expense">
          <AddIcon fontSize="small" />
        </AddButton>
      </CategoryItem>

      <CategoryItem>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconContainer bgcolor="#33A9FF">
            <SavingsIcon />
          </IconContainer>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Savings
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(savings)}
            </Typography>
          </Box>
        </Box>
        <AddButton
          bgcolor="#33A9FF"
          onClick={onAddSavings}
          aria-label="Add Savings"
          id="add-savings-button"
          sx={{
            zIndex: 9999,
            position: "relative",
          }}
        >
          <AddIcon fontSize="small" />
        </AddButton>
      </CategoryItem>

      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          right: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -20,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
      />
    </BalanceContainer>
  )
}

