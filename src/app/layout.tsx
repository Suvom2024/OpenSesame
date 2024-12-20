import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Sidebar } from "./components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OpenSesame",
  description: "Search and manage courses",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 relative">
            <div className="absolute top-0 right-0 w-full h-64 bg-[url('/net.svg')] bg-no-repeat bg-right-top opacity-30 pointer-events-none" />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

