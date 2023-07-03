import './globals.css'
import { Inter } from 'next/font/google'

import { TopNavBar } from '@/components/top-navbar'
import { ThemeProvider, NextAuthProvider } from './provider'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/authOptions'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ft_transendence',
  description: 'final project',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <NextAuthProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TopNavBar />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
