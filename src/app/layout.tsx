
'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavbar } from '@/components/dashboard/bottom-navbar';
import { useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase';


const backgroundImage = "https://picsum.photos/seed/farm/1920/1080";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
          src={backgroundImage}
          alt="Lush green farming fields"
          fill
          className="object-cover -z-10 transition-opacity duration-1000"
          data-ai-hint="green farming fields"
        />
         <FirebaseClientProvider>
          <main className="relative flex-1 pb-24">{children}</main>
          <BottomNavbar />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
