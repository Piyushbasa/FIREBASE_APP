import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavbar } from '@/components/dashboard/bottom-navbar';

export const metadata: Metadata = {
  title: 'AgriSmart',
  description: 'An AI-powered assistant for modern farming.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex flex-col min-h-screen">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNavbar />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
