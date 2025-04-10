"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useFinance } from "@/context/FinanceContext"
import { ColorModeContext } from "@/components/ClientProvider"
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useTheme,
  Alert,
  Snackbar,
  useMediaQuery,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material"
import {
  DownloadOutlined,
  RestartAlt,
  PersonOutline,
  Security,
  Edit as EditIcon,
  Save as SaveIcon,
  CloudDownload as CloudDownloadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  AccountBalanceWallet as WalletIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { styled } from "@mui/system"
import DashboardLayout from "@/components/DashboardLayout"
import DialogHeader from "@/components/dashboard/DialogHeader"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
  },
}))

const StyledButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease",
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: color ? color : theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${color ? color + "40" : theme.palette.primary.main + "40"}`,
  },
}))

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    boxShadow:
      theme.palette.mode === "light" ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
}))

const ProfileAvatar = styled(({ src, alt, children, ...props }) => {
  return (
    <Avatar src={src} alt={alt} {...props}>
      {!src && children}
    </Avatar>
  )
})(({ theme }) => ({
  width: 100,
  height: 100,
  backgroundColor: theme.palette.primary.main,
  fontSize: 40,
  fontWeight: "bold",
  boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
  border: `4px solid ${theme.palette.background.paper}`,
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}40`,
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  },
}))

const SettingsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.05)",
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}))

export default function Settings() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const colorMode = useContext(ColorModeContext)
  const { isAuthenticated, loading, user, logout } = useAuth()
  const { resetData } = useFinance()

  const [openResetDialog, setOpenResetDialog] = useState(false)
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "Hamdi Ben Jarrar",
    photoUrl: user?.image || null,
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Add loading state for export
  const [isExporting, setIsExporting] = useState(false)
  // Add a loading state for saving
  const [isSaving, setIsSaving] = useState(false)
  // Add isResetting state variable to track reset progress
  const [isResetting, setIsResetting] = useState(false)

  // Add this state for test results
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return null
  }

  // Update the handleReset function
  const handleReset = async () => {
    setIsResetting(true)
    setOpenResetDialog(false) // Close dialog immediately to avoid double clicks

    try {
      console.log("Attempting to reset data...")
      const success = await resetData()

      if (success) {
        setSnackbar({
          open: true,
          message: "All financial data has been reset",
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: "Failed to reset data. Please try again.",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Reset error:", error)
      setSnackbar({
        open: true,
        message: `Error: ${error.message || "An unknown error occurred"}`,
        severity: "error",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Update the handleExportData function to better handle errors
  const handleExportData = () => {
    // For showing loading state
    setIsExporting(true)

    // Make sure we have a valid user ID
    const userId = user?.id || ""
    if (!userId) {
      setSnackbar({
        open: true,
        message: "User ID is missing. Please try logging out and back in.",
        severity: "error",
      })
      setIsExporting(false)
      return
    }

    fetch(`/api/export?userId=${userId}`)
      .then(async (response) => {
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          // Try to get more detailed error message from response
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Export failed with status: ${response.status}`)
        }
        return response.blob()
      })
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob)
        // Create a temporary link element
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = "dinarwise-data.xlsx"
        // Add to document, click and remove
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Success message
        setSnackbar({
          open: true,
          message: "Data exported successfully",
          severity: "success",
        })
      })
      .catch((error) => {
        console.error("Export error:", error)
        setSnackbar({
          open: true,
          message: `Export failed: ${error.message}`,
          severity: "error",
        })
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
          photoUrl: profileData.photoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update the local state
      setEditingProfile(false)

      // Show success message
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      })
    } catch (error) {
      console.error("Error updating profile:", error)

      // Show error message
      setSnackbar({
        open: true,
        message: "Failed to update profile: " + error.message,
        severity: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSavePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords don't match",
        severity: "error",
      })
      return
    }

    // In a real app, this would verify the current password and update
    setOpenPasswordDialog(false)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setSnackbar({
      open: true,
      message: "Password updated successfully",
      severity: "success",
    })
  }

  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Add this function to test the API
  const testResetAPI = async () => {
    try {
      // Assuming testResetEndpoint is defined elsewhere and accessible
      const testResetEndpoint = async () => {
        // Replace with your actual API endpoint and logic
        const response = await fetch("/api/reset/test") // Example endpoint
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Test API failed with status: ${response.status}`)
        }
        return await response.json()
      }
      const result = await testResetEndpoint()
      setTestResult(result)
      setSnackbar({
        open: true,
        message: result.success ? "API test successful" : `API test failed: ${result.error}`,
        severity: result.success ? "success" : "error",
      })
    } catch (error) {
      console.error("Test error:", error)
      setTestResult({ success: false, error: error.message })
      setSnackbar({
        open: true,
        message: `API test error: ${error.message}`,
        severity: "error",
      })
    }
  }

  // Initialize state variables outside the conditional block
  let avatarUpload = null
  let profileAvatar = null

  if (editingProfile) {
    avatarUpload = (
      <>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader()
              reader.onload = (event) => {
                setProfileData((prev) => ({
                  ...prev,
                  photoUrl: event.target?.result?.toString() || null,
                }))
              }
              reader.readAsDataURL(e.target.files[0])
            }
          }}
        />
        <label htmlFor="avatar-upload">
          <Box sx={{ cursor: "pointer", position: "relative" }}>
            <ProfileAvatar src={profileData.photoUrl} alt={profileData.name}>
              {profileData.name.charAt(0)}
            </ProfileAvatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                left: 0,
                top: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                color: "white",
                opacity: 0.7,
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <EditIcon />
            </Box>
          </Box>
        </label>
      </>
    )
  } else {
    profileAvatar = (
      <>
        <ProfileAvatar src={profileData.photoUrl} alt={profileData.name}>
          {profileData.name.charAt(0)}
        </ProfileAvatar>
        <Tooltip title="Edit Profile">
          <IconButton
            size="small"
            onClick={() => setEditingProfile(true)}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    )
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: isMobile ? "1.75rem" : "2.125rem",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Account Settings
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your account and application preferences
            </Typography>
          </Box>

          {/* Profile Section */}
          <StyledPaper>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "flex-start",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {editingProfile ? avatarUpload : profileAvatar}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                {editingProfile ? (
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Edit Profile
                    </Typography>
                    <StyledTextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setEditingProfile(false)}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Cancel
                      </Button>
                      <StyledButton
                        startIcon={isSaving ? null : <SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
                      </StyledButton>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {profileData.name}
                      </Typography>
                      <Chip
                        label="Premium User"
                        size="small"
                        color="primary"
                        sx={{ ml: 2, height: 24, fontWeight: 500 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Member since January 2025
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Security />}
                        onClick={() => setOpenPasswordDialog(true)}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </StyledPaper>

          {/* Data Management Section */}
          <StyledPaper>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Data Management
            </Typography>
            <List>
              <StyledListItem>
                <ListItemIcon>
                  <CloudDownloadIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Export Data"
                  secondary="Download your financial data as xlsx"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <StyledButton
                    variant="contained"
                    size="small"
                    onClick={handleExportData}
                    color={theme.palette.primary.main}
                    startIcon={isExporting ? null : <DownloadOutlined />}
                    disabled={isExporting}
                  >
                    {isExporting ? <CircularProgress size={24} color="inherit" /> : "Export"}
                  </StyledButton>
                </motion.div>
              </StyledListItem>
              <Divider sx={{ my: 1 }} />
              <StyledListItem>
                <ListItemIcon>
                  <RestartAlt />
                </ListItemIcon>
                <ListItemText
                  primary="Reset Data"
                  secondary="Clear all your financial data"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                {/* Update the StyledButton in the reset dialog to include isResetting state */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <StyledButton
                    onClick={() => setOpenResetDialog(true)}
                    color={theme.palette.warning.main}
                    startIcon={<RestartAlt />}
                    disabled={isResetting}
                  >
                    {isResetting ? <CircularProgress size={24} color="inherit" /> : "Reset"}
                  </StyledButton>
                </motion.div>
              </StyledListItem>
            </List>
          </StyledPaper>

          {/* About Section */}
          <StyledPaper>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <WalletIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 28 }} />
              <Typography variant="h6" fontWeight="600">
                About DinarWise
              </Typography>
            </Box>
            <Typography variant="body2" paragraph>
              DinarWise is your personal finance companion designed to help you track income, expenses, and savings in
              Tunisian Dinar.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Version 1.0.0
              </Typography>
              <Chip label="Up to date" size="small" color="success" icon={<CheckIcon />} variant="outlined" />
            </Box>
          </StyledPaper>
        </motion.div>

        {/* Reset Data Dialog */}
        <StyledDialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
          <DialogHeader warningHeader={true} onClose={() => setOpenResetDialog(false)}>
            <Typography variant="subtitle1" fontWeight={600}>
              Reset Financial Data
            </Typography>
          </DialogHeader>
          <DialogContent sx={{ p: 3, pt: 3 }}>
            <DialogContentText>
              Are you sure you want to reset all your financial data? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setOpenResetDialog(false)}
              sx={{
                fontWeight: 500,
                borderRadius: 3,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            {/* Update the StyledButton in the reset dialog to include isResetting state */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton onClick={handleReset} color={theme.palette.error.main} disabled={isResetting}>
                {isResetting ? <CircularProgress size={24} color="inherit" /> : "Reset Data"}
              </StyledButton>
            </motion.div>
          </DialogActions>
        </StyledDialog>

        {/* Logout Dialog */}
        <StyledDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
          <DialogHeader warningHeader={false} onClose={() => setOpenLogoutDialog(false)}>
            <Typography variant="subtitle1" fontWeight={600}>
              Logout
            </Typography>
          </DialogHeader>
          <DialogContent sx={{ p: 3, pt: 3 }}>
            <DialogContentText>Are you sure you want to logout from your account?</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setOpenLogoutDialog(false)}
              sx={{
                fontWeight: 500,
                borderRadius: 3,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton onClick={handleLogout} color={theme.palette.primary.main}>
                Logout
              </StyledButton>
            </motion.div>
          </DialogActions>
        </StyledDialog>

        {/* Change Password Dialog */}
        <StyledDialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
          <DialogHeader warningHeader={false} onClose={() => setOpenPasswordDialog(false)}>
            <Typography variant="subtitle1" fontWeight={600}>
              Change Password
            </Typography>
          </DialogHeader>
          <DialogContent sx={{ p: 3, pt: 3 }}>
            <StyledTextField
              fullWidth
              margin="dense"
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleTogglePasswordVisibility("current")} edge="end">
                      {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              margin="dense"
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleTogglePasswordVisibility("new")} edge="end">
                      {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              margin="dense"
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleTogglePasswordVisibility("confirm")} edge="end">
                      {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setOpenPasswordDialog(false)}
              sx={{
                fontWeight: 500,
                borderRadius: 3,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton onClick={handleSavePassword} color={theme.palette.primary.main}>
                Update Password
              </StyledButton>
            </motion.div>
          </DialogActions>
        </StyledDialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow:
                theme.palette.mode === "light" ? "0 8px 16px rgba(0, 0, 0, 0.1)" : "0 8px 16px rgba(0, 0, 0, 0.3)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </DashboardLayout>
  )
}

