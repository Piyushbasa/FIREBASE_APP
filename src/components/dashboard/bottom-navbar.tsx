"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, Bot, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/market', label: 'Market', icon: Store },
  { href: '/assistant', label: 'Assistant', icon: Bot },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/community', label: 'Community', icon: Users },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-white/20 z-50">
      <div className="flex justify-around max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} className="flex-1">
              <div className={cn(
                "flex flex-col items-center justify-center p-2 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors",
                isActive && "text-primary bg-primary/10"
              )}>
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
