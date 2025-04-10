"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
  useMediaQuery,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  AccountBalanceWallet,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Google as GoogleIcon,
  ChevronRight,
  TrendingUp,
  BarChart,
  Savings,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { styled } from "@mui/system"

// Styled components with premium design
// Update the StyledPaper component to be even more compact
const StyledPaper = styled(Paper)({
  padding: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 12, // Reduced from 16
  boxShadow: "0 20px 80px -10px rgba(0, 0, 0, 0.3)",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  maxWidth: "280px", // Reduced from 320px
  width: "100%",
  margin: "0 auto",
  border: "1px solid rgba(255, 255, 255, 0.2)",
})

// Make the form container even more compact
const FormContainer = styled(Box)({
  width: "100%",
  padding: "12px 16px 16px", // Reduced from "16px 20px 20px"
})

// Make the logo container even more compact
const LogoContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  padding: "16px 0 12px", // Reduced from "20px 0 16px"
  width: "100%",
})

const Form = styled("form")({
  width: "100%",
  marginTop: 8,
})

const LogoIcon = styled(AccountBalanceWallet)({
  fontSize: 40,
  color: "#5C2AD2",
  filter: "drop-shadow(0 4px 6px rgba(92, 42, 210, 0.4))",
})

// Make the buttons even more compact
const StyledButton = styled(Button)({
  borderRadius: 6, // Reduced from 8
  padding: "6px 0", // Reduced from "8px 0"
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(92, 42, 210, 0.3)",
  background: "linear-gradient(90deg, #5C2AD2, #7B4DE3)",
  position: "relative",
  overflow: "hidden",
  fontSize: "0.85rem", // Added smaller font size
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transform: "translateX(-100%)",
  },
  "&:hover": {
    background: "linear-gradient(90deg, #4A1CA8, #6C3FD0)",
    boxShadow: "0 6px 16px rgba(92, 42, 210, 0.4)",
    transform: "translateY(-2px)",
    "&::before": {
      transform: "translateX(100%)",
      transition: "transform 0.8s ease",
    },
  },
})

// Modify the Google button to be even more compact
const GoogleButton = styled(Button)({
  borderRadius: 6, // Reduced from 8
  padding: "5px 0", // Reduced from "6px 0"
  fontWeight: 500,
  textTransform: "none",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  backgroundColor: "white",
  color: "#5f6368",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
  position: "relative",
  overflow: "hidden",
  fontSize: "0.8rem", // Added smaller font size
  "&:hover": {
    backgroundColor: "#f8f9fa",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-2px)",
  },
})

// Make the text fields even more compact
const StyledTextField = styled(TextField)({
  marginBottom: 6, // Reduced from 8
  "& .MuiOutlinedInput-root": {
    borderRadius: 6, // Reduced from 8
    transition: "all 0.2s ease",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    "&:hover": {
      boxShadow: "0 0 0 1px rgba(92, 42, 210, 0.4)",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 2px rgba(92, 42, 210, 0.4)",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    fontSize: "0.8rem", // Reduced from 0.85rem
  },
  "& .MuiInputBase-input": {
    padding: "8px 12px", // Reduced from "10px 14px"
    fontSize: "0.85rem", // Reduced from 0.9rem
  },
  "& .MuiInputAdornment-root": {
    color: "rgba(92, 42, 210, 0.7)",
    "& .MuiSvgIcon-root": {
      fontSize: "0.9rem", // Reduced from 1rem
    },
  },
})

const FeatureItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: 20,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateX(5px)",
  },
})

const FeatureIcon = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(92, 42, 210, 0.15)",
  color: "#5C2AD2",
  boxShadow: "0 4px 10px rgba(92, 42, 210, 0.2)",
  border: "1px solid rgba(92, 42, 210, 0.3)",
})

// Update the StyledTabs component
const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    height: 2,
    borderRadius: "2px 2px 0 0",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.85rem", // Reduced from 0.9rem
    minHeight: 36, // Reduced from 40
    transition: "all 0.2s",
    "&.Mui-selected": {
      color: "#5C2AD2",
    },
  },
})

// Animated background elements
const AnimatedGradient = ({ children }) => {
  return (
    <Box
      component={motion.div}
      animate={{
        background: [
          "linear-gradient(135deg, rgba(92, 42, 210, 0.8) 0%, rgba(30, 21, 80, 0.9) 100%)",
          "linear-gradient(135deg, rgba(30, 21, 80, 0.9) 0%, rgba(92, 42, 210, 0.8) 100%)",
          "linear-gradient(135deg, rgba(92, 42, 210, 0.8) 0%, rgba(30, 21, 80, 0.9) 100%)",
        ],
      }}
      transition={{
        duration: 15,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -2,
      }}
    >
      {children}
    </Box>
  )
}

// Reduce the number of floating orbs
const FloatingOrbs = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 5 }).map(
        (
          _,
          index, // Reduced from 8
        ) => (
          <Box
            key={index}
            component={motion.div}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 60 + 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            sx={{
              position: "absolute",
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(123, 77, 227, ${Math.random() * 0.3 + 0.1}) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        ),
      )}
    </Box>
  )
}

// Reduce the number of particles for better performance
const Particles = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 30 }).map(
        (
          _,
          index, // Reduced from 50
        ) => (
          <Box
            key={index}
            component={motion.div}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3,
              scale: Math.random() * 0.6 + 0.2,
            }}
            animate={{
              y: [0, -(Math.random() * 200 + 100), 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            sx={{
              position: "absolute",
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          />
        ),
      )}
    </Box>
  )
}

// Animated grid lines
const GridLines = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  )
}

// Make the animated logo even smaller
const AnimatedLogo = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        component={motion.div}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        sx={{
          bgcolor: "rgba(92, 42, 210, 0.1)",
          color: "#5C2AD2",
          borderRadius: "50%",
          width: 48, // Reduced from 56
          height: 48, // Reduced from 56
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1, // Reduced from 1.5
          boxShadow: "0 8px 20px -4px rgba(92, 42, 210, 0.4)",
          border: "2px solid rgba(92, 42, 210, 0.3)",
          position: "relative",
        }}
      >
        <LogoIcon sx={{ fontSize: 24 }} /> {/* Reduced from 28 */}
        {/* Animated rings around logo */}
        <Box
          component={motion.div}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          sx={{
            position: "absolute",
            top: -5, // Reduced from -6
            left: -5, // Reduced from -6
            right: -5, // Reduced from -6
            bottom: -5, // Reduced from -6
            borderRadius: "50%",
            border: "1px dashed rgba(92, 42, 210, 0.3)", // Reduced from 2px
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 },
          }}
          sx={{
            position: "absolute",
            top: -10, // Reduced from -12
            left: -10, // Reduced from -12
            right: -10, // Reduced from -12
            bottom: -10, // Reduced from -12
            borderRadius: "50%",
            border: "1px dashed rgba(92, 42, 210, 0.2)",
          }}
        />
      </Box>

      {/* Glowing effect under logo */}
      <Box
        component={motion.div}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          width: 48, // Reduced from 56
          height: 10, // Reduced from 12
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(92, 42, 210, 0.5) 0%, transparent 70%)",
          filter: "blur(10px)",
          top: 42, // Adjusted from 50
          left: "calc(50% - 24px)", // Adjusted from "calc(50% - 28px)"
          zIndex: -1,
        }}
      />
    </Box>
  )
}

// Update the feature cards to be even more compact
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 1.5, // Reduced from 2
        p: 1, // Reduced from 1.2
        mb: 0.8, // Reduced from 1
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.2 }}>
        {" "}
        {/* Reduced from mb: 0.3 */}
        <FeatureIcon sx={{ mr: 0.8, width: 32, height: 32 }}>{icon}</FeatureIcon> {/* Reduced size and margin */}
        <Typography variant="h6" sx={{ color: "white", fontWeight: 600, fontSize: "0.85rem" }}>
          {" "}
          {/* Reduced font size */}
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.7rem", ml: 4.5 }}>
        {" "}
        {/* Reduced font size and adjusted margin */}
        {description}
      </Typography>
    </Box>
  )
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0) // 0 for login, 1 for register
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const { login, register: registerUser, isAuthenticated, googleLogin } = useAuth()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width:900px)")
  const [animationComplete, setAnimationComplete] = useState(false)

  // Refs for animation sequencing
  const containerRef = useRef(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setError("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate form
      if (!email || !password) {
        setError("Email and password are required")
        setIsLoading(false)
        return
      }

      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const result = await registerUser(name, email, password)

      if (result.success) {
        setTabValue(0)
        setSnackbarMessage("Account created successfully! Please login.")
        setSnackbarOpen(true)
        // Clear form
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await googleLogin()
    } catch (error) {
      console.error("Google login error:", error)
      setError("An error occurred during Google login")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <>
      {/* Animated background */}
      <AnimatedGradient>
        <FloatingOrbs />
        <Particles />
        <GridLines />
      </AnimatedGradient>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: { xs: 0.5, sm: 1 }, // Reduced padding
          position: "relative",
          zIndex: 1,
        }}
        ref={containerRef}
      >
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1, md: 3 }, // Reduced gap
              width: "100%",
            }}
          >
            {/* Left side content */}
            <motion.div
              variants={itemVariants}
              style={{
                flex: 1,
                maxWidth: "500px",
                display: isMobile ? "none" : "block",
              }}
            >
              <Box sx={{ p: 2, color: "white" }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography
                    variant="h4" // Changed from h3 to h4
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      background: "linear-gradient(90deg, #fff, #d4c1ff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5, // Reduced from 1
                    }}
                  >
                    DinarWise
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "white", mb: 1 }}>
                    Take Control of Your Finances
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2, fontSize: "0.85rem" }}
                  >
                    DinarWise helps you track expenses, set savings goals, and gain insights into your financial habits
                    with powerful analytics and intuitive tools.
                  </Typography>
                </motion.div>

                {/* Feature cards */}
                <FeatureCard
                  icon={<TrendingUp />}
                  title="Track income, expenses, and savings"
                  description="Keep all your financial data in one place with easy-to-use tracking tools."
                  delay={0.8}
                />

                <FeatureCard
                  icon={<BarChart />}
                  title="Visualize spending patterns"
                  description="Gain insights with intuitive charts and reports to optimize your budget."
                  delay={1.0}
                />

                <FeatureCard
                  icon={<Savings />}
                  title="Set and achieve savings goals"
                  description="Track progress and reach your financial targets with personalized goals."
                  delay={1.2}
                />

                {/* Animated call to action */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  sx={{
                    mt: 2, // Reduced from 4
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "white", fontWeight: 500, mr: 1 }}>
                    Get started now
                  </Typography>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                  >
                    <ChevronRight sx={{ color: "white" }} />
                  </motion.div>
                </Box>
              </Box>
            </motion.div>

            {/* Right side - Login/Register form */}
            <motion.div variants={itemVariants} style={{ maxWidth: "400px", width: "100%" }}>
              <StyledPaper elevation={6}>
                <LogoContainer>
                  <AnimatedLogo />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Typography
                      component="h1"
                      variant="h6" // Changed from h5 to h6
                      fontWeight="bold"
                      sx={{
                        background: "linear-gradient(90deg, #5C2AD2, #7B4DE3)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "1.1rem", // Added smaller font size
                      }}
                    >
                      DinarWise
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Typography variant="caption" color="text.secondary" align="center" mt={0.3}>
                      Your Personal Finance Companion
                    </Typography>
                  </motion.div>

                  <StyledTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ width: "100%", mt: 3 }}
                  >
                    <Tab label="Login" />
                    <Tab label="Register" />
                  </StyledTabs>
                </LogoContainer>

                <FormContainer>
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          severity={error.includes("success") ? "success" : "error"}
                          sx={{ width: "100%", mb: 2, borderRadius: 2 }}
                        >
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {tabValue === 0 ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Form onSubmit={handleLogin}>
                          <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                    sx={{ padding: 0.5 }}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff fontSize="small" />
                                    ) : (
                                      <Visibility fontSize="small" />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <StyledButton
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              disabled={isLoading}
                              sx={{ mt: 1.5, mb: 1 }}
                              startIcon={isLoading ? null : <LoginIcon fontSize="small" />}
                            >
                              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
                            </StyledButton>
                          </motion.div>

                          <Divider sx={{ my: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                              OR
                            </Typography>
                          </Divider>

                          <Box sx={{ textAlign: "center", mb: 2 }}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <GoogleButton
                                onClick={handleGoogleLogin}
                                fullWidth
                                startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />}
                                size="large"
                              >
                                Sign in with Google
                              </GoogleButton>
                            </motion.div>
                          </Box>
                        </Form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Form onSubmit={handleRegister}>
                          <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="register-email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="register-password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="register-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                    sx={{ padding: 0.5 }}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff fontSize="small" />
                                    ) : (
                                      <Visibility fontSize="small" />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-password"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    size="small"
                                    sx={{ padding: 0.5 }}
                                  >
                                    {showConfirmPassword ? (
                                      <VisibilityOff fontSize="small" />
                                    ) : (
                                      <Visibility fontSize="small" />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <StyledButton
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              disabled={isLoading}
                              sx={{ mt: 1.5, mb: 1 }}
                            >
                              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Create Account"}
                            </StyledButton>
                          </motion.div>

                          <Divider sx={{ my: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                              OR
                            </Typography>
                          </Divider>

                          <Box sx={{ textAlign: "center", mb: 2 }}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <GoogleButton
                                onClick={handleGoogleLogin}
                                fullWidth
                                startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />}
                                size="large"
                              >
                                Sign up with Google
                              </GoogleButton>
                            </motion.div>
                          </Box>
                        </Form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1, display: "block", fontSize: "0.65rem" }}
                  >
                    © 2025 DinarWise. All rights reserved.
                  </Typography>
                </FormContainer>
              </StyledPaper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
