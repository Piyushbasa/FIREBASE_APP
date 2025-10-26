"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Bot, GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/market', label: 'Market', icon: BarChart2 },
  { href: '/assistant', label: 'Assistant', icon: Bot },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/community', label: 'Community', icon: Users },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/60 border-t border-white/10 z-50 backdrop-blur-sm">
      <div className="flex justify-around max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center p-2">
                <item.icon className={cn(
                  "w-6 h-6 mb-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                   isActive ? "text-primary" : "text-muted-foreground"
                )}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
