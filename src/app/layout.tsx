import type { Metadata } from 'next';
import Image from 'next/image';
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
        <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
            alt="Green field background"
            fill
            className="object-cover -z-10"
            data-ai-hint="green field"
          />
        <div className="relative flex flex-col min-h-screen bg-black/30">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNavbar />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
