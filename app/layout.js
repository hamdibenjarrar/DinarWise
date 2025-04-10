import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { AuthSessionProvider } from "@/components/AuthSessionProvider"
import { ThemeProvider } from "@/components/theme-provider"
import ClientProvider from "@/components/ClientProvider"

// Use Poppins as our primary font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

// Keep Inter as a fallback
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "DinarWise - Personal Finance Companion",
  description: "Take control of your finances in Tunisian Dinar with DinarWise",
  generator: "Hamdi Ben Jarrar",
  metadataBase: new URL("https://dinarwise.me"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} font-sans`}>
        <ThemeProvider>
          <AuthSessionProvider>
            <ClientProvider>{children}</ClientProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
