import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Akheel Kappoor | Business Analyst',
  description: 'Business Analyst with 1+ year of experience delivering 80+ projects. Expert in SQL, Python, Excel, Power BI, and Tableau. Available for opportunities in Dubai, UAE.',
  keywords: ['Business Analyst', 'Data Analytics', 'SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'Dubai', 'UAE'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
