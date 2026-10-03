import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CustomCursor } from '@/components/custom-cursor'
import './globals.css'

// Archivo is a variable font with a width axis, so one file gives both the
// expanded display headline (font-stretch: 125%) and normal-width body text.
// Self-hosted: no runtime request to Google Fonts.
const archivo = localFont({
  src: './fonts/archivo-variable.woff2',
  variable: '--font-archivo',
  display: 'swap',
  weight: '100 900',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
})

export const metadata: Metadata = {
  title: 'Itzfizz Digital — Make Brands Impossible to Ignore',
  description:
    "Itzfizz Digital is an independent digital marketing agency built for brands that move at culture's speed.",
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
}

// Runs before first paint. It tells CSS that JavaScript is available, so the
// intro animation can start from a hidden state without a flash. Without JS the
// page simply renders fully visible.
const MARK_JS_ENABLED = "document.documentElement.classList.add('js')"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_JS_ENABLED }} />
      </head>
      <body className="bg-ink font-sans text-white antialiased">
        {children}
        <div aria-hidden="true" className="grain" />
        <CustomCursor />
      </body>
    </html>
  )
}
