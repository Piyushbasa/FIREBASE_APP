
'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavbar } from '@/components/dashboard/bottom-navbar';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelector } from '@/components/dashboard/language-selector';
import { navItems } from '@/lib/nav-items';
import { ConnectionStatusIndicator } from '@/components/dashboard/ConnectionStatusIndicator';


const backgroundImage = "https://images.unsplash.com/photo-1492944548512-5a90181354d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


function AppSidebar() {
    const pathname = usePathname();
    const sidebarNavItems = navItems.filter(item => item.isDesktop);
    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-1.5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M11 20A7 7 0 0 1 4 13H2a2 2 0 1 0-4 0h2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z M4 13c0-4.5 3-5.5 3-5.5s3 .5 3 5.5c0 .4 0 .8.1 1.2M17 12v.5A2.5 2.5 0 0 0 19.5 15h0A2.5 2.5 0 0 0 22 12.5V12a3 3 0 0 0-3-3 3 3 0 0 0-3 3Z"></path></svg>
                    </div>
                    <h1 className="text-xl font-bold font-headline text-foreground">
                    AgriAssist
                    </h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sidebarNavItems.map((item) => (
                         <SidebarMenuItem key={item.href}>
                             <Link href={item.href} className='w-full'>
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
    title: 'AgriAssist',
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
                         <SidebarInset className="relative pt-12 md:pt-4 pb-24 md:pb-4">
                            <ConnectionStatusIndicator />
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
