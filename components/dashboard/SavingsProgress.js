"use client"

import { useState, useEffect } from "react"
import { useFinance } from "@/context/FinanceContext"
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  InputAdornment,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/system"
import { formatCurrency } from "@/utils/formatters"
import { Edit, Close as CloseIcon, Lightbulb } from "@mui/icons-material"
import { motion } from "framer-motion"

const SavingsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
  },
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  },
}))

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

const StyledLinearProgress = styled(LinearProgress)(
  ({ theme, colorname = "info" }) => ({
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
    "& .MuiLinearProgress-bar": {
      borderRadius: 6,
      background: `linear-gradient(90deg, ${theme.palette[colorname].main}, ${theme.palette.primary.main})`,
    },
  }),
  {
    shouldForwardProp: (prop) => prop !== "colorname",
  },
)

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "6px 16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease",
  background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
  color: theme.palette.common.white,
  "&:hover": {
    background: `linear-gradient(90deg, ${theme.palette.info.dark}, ${theme.palette.primary.dark})`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${theme.palette.info.main}40`,
  },
}))

const TipBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2.5),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "light" ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.15)",
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${theme.palette.mode === "light" ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.3)"}`,
}))

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    boxShadow:
      theme.palette.mode === "light" ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
}))

const DialogHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background:
    theme.palette.mode === "light"
      ? `linear-gradient(135deg, ${theme.palette.info.light}20, ${theme.palette.info.main}40)`
      : `linear-gradient(135deg, ${theme.palette.info.main}40, ${theme.palette.info.dark}60)`,
  color: theme.palette.mode === "light" ? theme.palette.info.main : theme.palette.common.white,
  fontWeight: 600,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

export default function SavingsProgress() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { savings, addSavingsGoal, savingsGoal } = useFinance()
  const [openDialog, setOpenDialog] = useState(false)
  const [goalAmount, setGoalAmount] = useState(savingsGoal || 10000)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (savingsGoal > 0) {
      setProgress((savings / savingsGoal) * 100)
    } else {
      setProgress(0)
    }
  }, [savings, savingsGoal])

  const handleOpenDialog = () => {
    setGoalAmount(savingsGoal || 10000)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSaveGoal = () => {
    addSavingsGoal(Number(goalAmount))
    setOpenDialog(false)
  }

  return (
    <SavingsContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
          Savings Progress
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StyledButton startIcon={<Edit />} size="small" onClick={handleOpenDialog}>
            Set Goal
          </StyledButton>
        </motion.div>
      </Box>

      <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Current Savings
          </Typography>
          <Typography variant="body2" fontWeight="600">
            {formatCurrency(savings)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Savings Goal
          </Typography>
          <Typography variant="body2" fontWeight="600">
            {formatCurrency(savingsGoal)}
          </Typography>
        </Box>
      </Box>

      <ProgressContainer>
        <StyledLinearProgress variant="determinate" value={Math.min(progress, 100)} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {progress.toFixed(0)}% Complete
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {formatCurrency(savingsGoal - savings)} Remaining
          </Typography>
        </Box>
      </ProgressContainer>

      <TipBox>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
          <Lightbulb sx={{ color: theme.palette.info.main, mr: 1, mt: 0.2 }} />
          <Box>
            <Typography variant="subtitle2" color="info.main" fontWeight="bold">
              Savings Tip
            </Typography>
            <Typography variant="body2" color={theme.palette.mode === "light" ? "text.primary" : "text.secondary"}>
              Try to save at least 20% of your monthly income to reach your financial goals faster. Small, consistent
              contributions add up over time!
            </Typography>
          </Box>
        </Box>
      </TipBox>

      {/* Set Goal Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogHeader>
          <Box component="div">
            <Typography variant="subtitle1" fontWeight={600}>
              Set Savings Goal
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">TND</InputAdornment>,
            }}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Set a realistic savings goal that you can achieve over time. We recommend saving at least 20% of your
            income.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              fontWeight: 500,
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <StyledButton onClick={handleSaveGoal} variant="contained">
              Save Goal
            </StyledButton>
          </motion.div>
        </DialogActions>
      </StyledDialog>
    </SavingsContainer>
  )
}

