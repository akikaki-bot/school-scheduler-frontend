import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Root } from './root'
import { NavigationBar } from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HS API Developers',
  description: 'High School Scaduler API Develpersのホームページ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Root>
          <NavigationBar />
          {children}
        </Root>
      </body>
    </html>
  )
}
