"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/AuthContext"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useMediaQuery,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon,
} from "@mui/icons-material"

// Only import WavyText for the logo
import WavyText from "@/components/ui/WavyText"

const drawerWidth = 260

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width:900px)")
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    // Close drawer on mobile when route changes
    if (isMobile) {
      setIsDrawerOpen(false)
    } else {
      setIsDrawerOpen(true)
    }
  }, [pathname, isMobile])

  // Redirect to login if not authenticated
  useEffect(() => {
    // We'll skip this check for now to simplify development
    // if (!user) {
    //   router.push('/login');
    // }
  }, [user, router])

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen])

  const handleProfileMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleLogout = useCallback(async () => {
    handleProfileMenuClose()
    await logout()
    router.push("/login")
  }, [handleProfileMenuClose, logout, router])

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <CalendarIcon />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <AnalyticsIcon />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <SettingsIcon />,
    },
  ]

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "background.paper",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "center",
            borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
          }}
        >
          <Link
            href="/dashboard"
            style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#5C2AD2",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(92, 42, 210, 0.3)",
              }}
            >
              <WalletIcon sx={{ color: "#fff" }} />
            </Box>
            <Box sx={{ ml: 1.5 }}>
              <WavyText
                text="DinarWise"
                color="#5C2AD2"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  lineHeight: "1.6",
                }}
              />
            </Box>
          </Link>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} edge="end">
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>

        {/* User info - removed email completely */}
        <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: `1px solid rgba(0, 0, 0, 0.12)` }}>
          <Avatar
            src={user?.image}
            alt={user?.name || "User"}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#5C2AD2",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ ml: 1.5, overflow: "hidden" }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {user?.name || "Demo User"}
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ flexGrow: 1, overflow: "auto", py: 2 }}>
          <List>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <ListItem
                  key={item.name}
                  component={Link}
                  href={item.href}
                  sx={{
                    px: 2,
                    py: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    mx: 1,
                    color: isActive ? "#fff" : "inherit",
                    bgcolor: isActive ? "#5C2AD2" : "transparent",
                    "&:hover": {
                      bgcolor: isActive ? "#5C2AD2" : "rgba(0,0,0,0.04)",
                    },
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 1, // Ensure clickable
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "#fff" : "#5C2AD2",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </ListItem>
              )
            })}
          </List>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid rgba(0, 0, 0, 0.12)`,
          }}
        >
          <ThemeToggle />
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#FF4A5E",
                "&:hover": { bgcolor: "rgba(255, 74, 94, 0.1)" },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
              zIndex: 1300, // Increase z-index
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          bgcolor: "background.default",
          minHeight: "100vh",
          position: "relative",
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { xs: 0, md: `${drawerWidth}px` },
          overflowX: "hidden",
          zIndex: 1, // Lower z-index than drawer
        }}
      >
        {/* Mobile app bar */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 1,
              borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <WavyText
                text="DinarWise"
                color="#5C2AD2"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              />
            </Box>
            <Box>
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar src={user?.image} alt={user?.name || "User"} sx={{ width: 32, height: 32, bgcolor: "#5C2AD2" }}>
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem component={Link} href="/settings" onClick={handleProfileMenuClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: "#FF4A5E" }} />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
        {children}
      </Box>
    </Box>
  )
}

