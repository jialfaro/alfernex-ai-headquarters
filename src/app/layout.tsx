import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#030712'
};

export const metadata: Metadata = {
  title: 'ALFERNEX AI HEADQUARTERS // Where Intelligence Works',
  description:
    'Where Intelligence Works. Luxury futuristic headquarters of autonomous AI executives collaborating on scale, TikTok ads, real-time Shopify COD logistics, and e-commerce growth.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Alfernex HQ'
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full bg-[#030712]">
      <body className="h-full w-full overflow-hidden bg-[#030712] text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
