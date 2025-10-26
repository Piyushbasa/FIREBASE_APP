
'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavbar } from '@/components/dashboard/bottom-navbar';
import { useEffect, useState } from 'react';

const dayImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop";
const nightImage = "https://images.unsplash.com/photo-1444703686981-a3abbc4d42e2?q=80&w=2070&auto=format&fit=crop";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDayTime, setIsDayTime] = useState(true);

  useEffect(() => {
    const getIndianTime = () => {
      const now = new Date();
      // IST is UTC+5:30
      const utcOffset = now.getTimezoneOffset() * 60000;
      const istOffset = 5.5 * 3600000;
      return new Date(now.getTime() + utcOffset + istOffset);
    };

    const indianHour = getIndianTime().getHours();
    // Day time between 6 AM and 6 PM (18:00)
    setIsDayTime(indianHour >= 6 && indianHour < 18);
  }, []);

  const metadata: Metadata = {
    title: 'AgriSmart',
    description: 'An AI-powered assistant for modern farming.',
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Image
            src={isDayTime ? dayImage : nightImage}
            alt={isDayTime ? "Colorful green field background during the day" : "Starry night sky over a field"}
            fill
            className="object-cover -z-10 transition-opacity duration-1000"
            data-ai-hint={isDayTime ? "green field" : "night sky"}
          />
        <main className="relative flex-1 pb-24">{children}</main>
        <BottomNavbar />
        <Toaster />
      </body>
    </html>
  );
}
