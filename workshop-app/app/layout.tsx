import type { Metadata, Viewport } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Outfit - Modern geometric sans-serif for headings and UI
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// JetBrains Mono - Technical monospace for data and code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1222' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Workshop Intelligence System | NOVATEK',
    template: '%s | WIS',
  },
  description: 'AI-powered workflow automation for the Brimis 11-Step Service Excellence Process. Built by NOVATEK - Precision Industrial Intelligence.',
  manifest: '/manifest.json',
  applicationName: 'Workshop Intelligence System',
  authors: [{ name: 'NOVATEK LLC', url: 'https://www.novatek.co.za' }],
  creator: 'NOVATEK LLC',
  publisher: 'NOVATEK LLC',
  keywords: ['workshop', 'intelligence', 'AI', 'workflow', 'automation', 'NOVATEK', 'industrial'],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WIS',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Workshop Intelligence System',
    title: 'Workshop Intelligence System | NOVATEK',
    description: 'AI-powered workflow automation for industrial workshop excellence.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased dark">
        <TooltipProvider delayDuration={300}>
          {/* Noise texture overlay for premium feel */}
          <div className="noise-overlay" aria-hidden="true" />

          {/* Main application */}
          <main className="min-h-screen bg-background">
            {children}
          </main>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="dark"
            toastOptions={{
              classNames: {
                toast: 'glass-card border-border/50',
                title: 'font-medium',
                description: 'text-muted-foreground',
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
