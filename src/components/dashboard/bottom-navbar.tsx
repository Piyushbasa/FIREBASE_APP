
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Bot, GraduationCap, MessageSquare, User, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/market', label: 'Market', icon: BarChart2 },
  { href: '/assistant', label: 'Assistant', icon: Bot },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/community', label: 'Forum', icon: MessageSquare },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 border-t z-50 backdrop-blur-sm md:hidden">
      <div className="flex justify-around max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} className={cn(
              "flex-1 flex flex-col items-center justify-center p-2 transition-colors duration-200",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
            )}>
                <item.icon className="w-6 h-6 mb-1" />
                <span className={cn(
                  "text-xs font-medium transition-all duration-200 ease-in-out",
                  isActive ? "opacity-100 max-h-4" : "opacity-0 max-h-0"
                )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
