"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/nav-items';

const bottomNavItems = navItems.filter(item => item.isMobile);

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 border-t z-50 backdrop-blur-sm md:hidden">
      <div className="flex justify-around max-w-7xl mx-auto">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} className={cn(
              "flex-1 flex flex-col items-center justify-center p-2 transition-colors duration-200",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
            )}>
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
