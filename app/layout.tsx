import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CustomCursor } from '@/components/custom-cursor'
import './globals.css'

// Montserrat (variable weight): a bold geometric sans close to Itzfizz's own
// typography. Self-hosted, so no runtime request to Google Fonts.
const montserrat = localFont({
  src: './fonts/montserrat-variable.woff2',
  variable: '--font-montserrat',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Itzfizz Digital — 10X Your Growth',
  description:
    'Grow your business with customized strategies in social media marketing, SEO, web development, branding and UI/UX design.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fff355',
}

// Runs before first paint. It tells CSS that JavaScript is available, so the
// intro animation can start from a hidden state without a flash. Without JS the
// page simply renders fully visible.
const MARK_JS_ENABLED = "document.documentElement.classList.add('js')"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_JS_ENABLED }} />
      </head>
      <body className="bg-white font-sans text-ink antialiased">
        {children}
        <div aria-hidden="true" className="grain" />
        <CustomCursor />
      </body>
    </html>
  )
}
