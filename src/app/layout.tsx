import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppLayout } from '@/components/AppLayout'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  preload: true
})

export const metadata: Metadata = {
  title: 'SeeYourBz - 日历应用',
  description: '基于tyme4ts的强大日历应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <body className={`${inter.className} font-sans antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
} 