import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import ThemeToggle from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CoHustle - Find Your Perfect Side Hustle",
  description: "Discover personalized side hustle opportunities that match your skills, location, and schedule. Powered by AI.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="fixed top-3 right-3 z-50">
            <ThemeToggle />
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
