import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/hooks/use-cart"
import { ToastProvider } from "@/components/toasts"
import AuthProvider from "@/components/auth-provider"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://soumyafurnishings.com"),
  title: "Soumya Furnishings - Luxury Home Décor",
  description:
    "Elevate Your Everyday — Artisan-crafted home décor from India with premium materials and sustainable packaging.",
  generator: "v0.app",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soumyafurnishings.com",
    siteName: "Soumya Furnishings",
    images: [
      {
        url: "/luxury-home-decor.jpg",
        width: 1200,
        height: 1200,
      },
    ],
  },
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#F9F8F5" />
      </head>
      <body className={`${playfairDisplay.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
