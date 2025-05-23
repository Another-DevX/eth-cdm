import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

import { headers } from 'next/headers' // added
import ContextProvider from '@/context'
import { Navbar } from '@/components/Navbar'
import { BadgeProvider } from '@/lib/badgeContext'

export const metadata: Metadata = {
  title: 'Platonautas',
  description: 'Platonautas - Tu plataforma de viajes espaciales',
};
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          <BadgeProvider>
            {children}
            <Toaster />
          </BadgeProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
