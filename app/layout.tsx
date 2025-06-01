import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YouDescript✨',
  description: 'app to generate youtube description',
}

export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
