import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: "HydBloodChain - Hyderabad Blood Supply Intelligence",
  description:
    "Blockchain-powered blood supply chain management for Hyderabad. Real-time shortage detection, XAI predictions, and donor-hospital connectivity.",
}

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
