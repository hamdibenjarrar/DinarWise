"use client"

import { useState } from "react"
import { Box, SpeedDial, SpeedDialAction, useTheme, useMediaQuery, Tooltip, Typography } from "@mui/material"
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Savings as SavingsIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { styled } from "@mui/system"

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  "& .MuiFab-primary": {
    backgroundColor: theme.palette.primary.main,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}80`,
    "&:hover": {
      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
      boxShadow: `0 6px 20px 0 ${theme.palette.primary.main}90`,
    },
  },
}))

const ActionLabel = styled(Typography)(({ theme }) => ({
  position: "absolute",
  right: "100%",
  marginRight: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.palette.mode === "light" ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.3)",
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
}))

export default function AddTransactionButton({ onAddIncome, onAddExpense, onAddSavings }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const actions = [
    {
      icon: <IncomeIcon />,
      name: "Add Income",
      colorname: "success",
      onClick: () => {
        onAddIncome()
        handleClose()
      },
    },
    {
      icon: <ExpenseIcon />,
      name: "Add Expense",
      colorname: "error",
      onClick: () => {
        onAddExpense()
        handleClose()
      },
    },
    {
      icon: <SavingsIcon />,
      name: "Add Savings",
      colorname: "info",
      onClick: () => {
        onAddSavings()
        handleClose()
      },
    },
  ]

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        zIndex: 1200, // Increase z-index to ensure it's above other elements
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3,
        }}
      >
        <Tooltip title={open ? "Close" : "Add Transaction"} placement="left">
          <StyledSpeedDial
            ariaLabel="Add Transaction"
            icon={open ? <CloseIcon /> : <AddIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction="up"
            FabProps={{
              sx: {
                width: isMobile ? 56 : 64,
                height: isMobile ? 56 : 64,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              },
            }}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen={!isMobile}
                onClick={action.onClick}
                FabProps={{
                  sx: {
                    bgcolor: theme.palette[action.colorname]?.main || theme.palette.primary.main,
                    color: "white",
                    boxShadow: `0 4px 8px 0 ${theme.palette[action.colorname]?.main || theme.palette.primary.main}50`,
                    "&:hover": {
                      bgcolor: theme.palette[action.colorname]?.main || theme.palette.primary.main,
                      opacity: 0.9,
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <AnimatePresence>
                  {!isMobile && open && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ActionLabel>{action.name}</ActionLabel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpeedDialAction>
            ))}
          </StyledSpeedDial>
        </Tooltip>
      </motion.div>
    </Box>
  )
}

