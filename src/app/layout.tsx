import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'AgriAssist',
  description: 'An AI-powered assistant for modern farming.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Image
          src="https://images.unsplash.com/photo-1464979925219-5381a5a8a184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZmllbGRzfGVufDB8fHx8MTY5OTM0NjA0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Colorful crop fields"
          fill
          className="-z-10 object-cover brightness-50"
          data-ai-hint="crop fields"
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
