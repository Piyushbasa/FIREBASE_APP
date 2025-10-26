"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Drill, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tools', label: 'Tools', icon: Drill },
  { href: '/community', label: 'Community', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="flex justify-around max-w-7xl mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center p-3">
                <item.icon className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs font-medium",
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
