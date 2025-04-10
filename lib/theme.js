// Default theme configuration for the application
const theme = {
  colors: {
    primary: "#5C2AD2",
    secondary: "#7B4DE3",
    error: "#FF4A5E",
    warning: "#F59E0B",
    info: "#33A9FF",
    success: "#4CAF50",
  },
  spacing: (multiplier = 1) => `${multiplier * 8}px`,
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "24px",
    round: "50%",
  },
  shadows: {
    small: "0 2px 8px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.1)",
    large: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    fast: "0.2s",
    medium: "0.3s",
    slow: "0.5s",
  },
}

export default theme

