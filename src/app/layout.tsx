
'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavbar } from '@/components/dashboard/bottom-navbar';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { BarChart2, Bot, GraduationCap, Home, Leaf, MessageSquare, User, Wrench, Landmark } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/dashboard/language-selector';


const backgroundImage = "https://images.unsplash.com/photo-1492944548512-5a90181354d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const sidebarNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/market', label: 'Market', icon: BarChart2 },
  { href: '/assistant', label: 'Assistant', icon: Bot },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/community', label: 'Forum', icon: MessageSquare },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: 'https://farmer.gov.in/', label: 'Govt. Schemes', icon: Landmark, external: true },
  { href: '/profile', label: 'Profile', icon: User },
];

function AppSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-3">
                    <Leaf className="h-7 w-7 text-primary" />
                    <h1 className="text-xl font-bold font-headline text-foreground">
                    AgriSmart
                    </h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sidebarNavItems.map((item) => (
                         <SidebarMenuItem key={item.href}>
                             <Link href={item.href} className='w-full' target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
                                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                         </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <LanguageSelector />
            </SidebarFooter>
        </Sidebar>
    );
}


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
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <FirebaseClientProvider>
                <SidebarProvider>
                    <Image
                        src={backgroundImage}
                        alt="Lush green farming fields"
                        fill
                        className="object-cover -z-10 transition-opacity duration-1000"
                        data-ai-hint="green farming fields"
                    />
                    <div className="md:flex">
                        <AppSidebar />
                         <SidebarInset className="relative pb-24 md:pb-4">
                            {children}
                        </SidebarInset>
                    </div>
                    <BottomNavbar />
                    <Toaster />
                </SidebarProvider>
            </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
