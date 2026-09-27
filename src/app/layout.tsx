import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ALFERNEX AI HEADQUARTERS // Where Intelligence Works',
  description:
    'Where Intelligence Works. Luxury futuristic headquarters of autonomous AI executives collaborating on scale, TikTok ads, real-time Shopify COD logistics, and e-commerce growth.',
  icons: {
    icon: '/favicon.ico'
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
