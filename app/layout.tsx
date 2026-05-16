import './globals.css'
import SmoothScrolling from '@/components/ui/SmoothScrolling'
import Toaster from '@/components/ui/Toaster'

export const metadata = {
  title: 'WebCraft AI',
  description: 'AI-powered website builder. Speak your design, drag & drop, and deploy instantly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrolling>{children}</SmoothScrolling>
        <Toaster />
      </body>
    </html>
  )
}
