import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/lib/UserContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlogOS',
  description: 'A beautiful, AI-powered blogging platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <UserProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  )
}
