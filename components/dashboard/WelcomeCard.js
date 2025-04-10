"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material"
import { styled } from "@mui/system"
import { motion } from "framer-motion"
import {
  Close as CloseIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Savings as SavingsIcon,
  BarChart as ChartIcon,
} from "@mui/icons-material"

// Add WavyText import
import WavyText from "@/components/ui/WavyText"

const WelcomeContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  background:
    theme.palette.mode === "light"
      ? `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}20)`
      : `linear-gradient(135deg, ${theme.palette.primary.dark}30, ${theme.palette.secondary.dark}40)`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}))

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}))

const LogoIcon = styled(WalletIcon)(({ theme }) => ({
  fontSize: 32,
  color: theme.palette.primary.main,
  marginRight: theme.spacing(1.5),
  filter: `drop-shadow(0 2px 4px ${theme.palette.primary.main}40)`,
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 20px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease",
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  "&:hover": {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${theme.palette.primary.main}40`,
  },
}))

const StepIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorname",
})(({ theme, colorname }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "50%",
  backgroundColor: theme.palette[colorname]?.main || theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: `0 4px 8px ${theme.palette[colorname]?.main || theme.palette.primary.main}40`,
}))

export default function WelcomeCard({ onDismiss, onAddTransaction }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const steps = [
    {
      label: "Welcome to DinarWise",
      description: "Your personal finance companion to help you track income, expenses, and savings in Tunisian Dinar.",
      icon: <WalletIcon />,
      colorname: "primary",
    },
    {
      label: "Track Your Income",
      description: "Add your income sources to keep track of all your earnings in one place.",
      icon: <IncomeIcon />,
      colorname: "success",
      action: () => onAddTransaction("income"),
    },
    {
      label: "Manage Expenses",
      description: "Record your expenses to understand your spending habits and identify areas to save.",
      icon: <ExpenseIcon />,
      colorname: "error",
      action: () => onAddTransaction("expense"),
    },
    {
      label: "Set Savings Goals",
      description: "Create savings goals and track your progress towards financial freedom.",
      icon: <SavingsIcon />,
      colorname: "info",
      action: () => onAddTransaction("savings"),
    },
    {
      label: "Analyze Your Finances",
      description: "View detailed charts and analytics to gain insights into your financial health.",
      icon: <ChartIcon />,
      colorname: "warning",
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <WelcomeContainer>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <LogoContainer>
            <LogoIcon />
            <WavyText
              text="DinarWise"
              color={theme.palette.primary.main}
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            />
          </LogoContainer>
          <IconButton
            onClick={onDismiss}
            size="small"
            sx={{
              bgcolor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={() => <StepIcon colorname={step.colorname}>{step.icon}</StepIcon>}>
                <Typography variant="subtitle1" fontWeight="600">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {step.action && (
                      <StyledButton variant="contained" onClick={step.action} sx={{ mr: 1, mb: isMobile ? 1 : 0 }}>
                        Try Now
                      </StyledButton>
                    )}
                    <StyledButton
                      variant="contained"
                      onClick={index === steps.length - 1 ? onDismiss : handleNext}
                      sx={{ mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </StyledButton>
                    {index > 0 && (
                      <Button
                        onClick={handleBack}
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                      >
                        Back
                      </Button>
                    )}
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              You're all set!
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start managing your finances with DinarWise today.
            </Typography>
            <StyledButton onClick={onDismiss}>Get Started</StyledButton>
          </Box>
        )}
      </WelcomeContainer>
    </motion.div>
  )
}

