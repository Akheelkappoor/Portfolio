import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { ColorThemeProvider } from '@/components/color-theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Akheel Kappoor | Business Analyst',
  description: 'Business Analyst with 1+ year of experience delivering 80+ projects. Expert in SQL, Python, Excel, Power BI, and Tableau. Available for opportunities in Dubai, UAE.',
  keywords: ['Business Analyst', 'Data Analytics', 'SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'Dubai', 'UAE'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <ColorThemeProvider>
          {children}
          <Toaster />
          <Analytics />
        </ColorThemeProvider>
      </body>
    </html>
  )
}
