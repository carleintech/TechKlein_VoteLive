import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/Navigation';
import { InstallPWA } from '@/components/InstallPWA';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1F41FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'TechKlein VoteLive – Sondaj Ayiti Global',
  description: 'Global Haitian pre-election poll platform. Vote securely from anywhere in the world.',
  keywords: ['Haiti', 'election', 'vote', 'poll', 'sondaj', 'TechKlein'],
  authors: [{ name: 'TechKlein' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VoteLive',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'TechKlein VoteLive – Sondaj Ayiti Global',
    description: 'Global Haitian pre-election poll platform',
    type: 'website',
    locale: 'ht_HT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechKlein VoteLive',
    description: 'Global Haitian pre-election poll',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ht">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F41FF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Navigation />
        {children}
        <InstallPWA />
        <Toaster />
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => console.log('SW registered:', registration.scope))
                  .catch(err => console.log('SW registration failed:', err));
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
