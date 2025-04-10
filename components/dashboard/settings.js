"use client"
import { Box, Typography, Grid, useTheme } from "@mui/material"
import styled from "@emotion/styled"
import { MonetizationOn as IncomeIcon, ShoppingCart as ExpenseIcon } from "@mui/icons-material"

const Settings = () => {
  const theme = useTheme()

  const SummaryCard = styled(Box)(({ theme, type }) => {
    let color
    switch (type) {
      case "income":
        color = theme.palette.success
        break
      case "expense":
        color = theme.palette.error
        break
      case "savings":
        color = theme.palette.info
        break
      default:
        color = theme.palette.primary
    }

    return {
      padding: theme.spacing(1.5),
      borderRadius: 12,
      backgroundColor: `${color.main}10`,
      border: `1px solid ${color.main}30`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing(2),
    }
  })

  const IconContainer = styled(Box)(({ theme, colorname }) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: theme.palette[colorname]?.main || theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
    marginRight: theme.spacing(1.5),
    boxShadow: `0 4px 8px ${theme.palette[colorname]?.main || theme.palette.primary.main}40`,
  }))

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SummaryCard type="income">
            <Box display="flex" alignItems="center">
              <IconContainer colorname="success">
                <IncomeIcon />
              </IconContainer>
              <Typography variant="subtitle1">Income</Typography>
            </Box>
            <Typography variant="h6">$5,000</Typography>
          </SummaryCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SummaryCard type="expense">
            <Box display="flex" alignItems="center">
              <IconContainer colorname="error">
                <ExpenseIcon />
              </IconContainer>
              <Typography variant="subtitle1">Expenses</Typography>
            </Box>
            <Typography variant="h6">$2,500</Typography>
          </SummaryCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings

