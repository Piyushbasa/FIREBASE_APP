
import { BarChart2, Bot, GraduationCap, Home, MessageSquare, User, Wrench, Sprout } from 'lucide-react';

export const navItems = [
  { href: '/', label: 'Home', icon: Home, isMobile: true, isDesktop: false },
  { href: '/market', label: 'Market', icon: BarChart2, isMobile: true, isDesktop: false },
  { href: '/tools', label: 'Tools', icon: Wrench, isMobile: true, isDesktop: false },
  { href: '/profile', label: 'Profile', icon: User, isMobile: true, isDesktop: false },
  { href: '/assistant', label: 'Assistant', icon: Bot, isMobile: false, isDesktop: true },
  { href: '/learn', label: 'Learn', icon: GraduationCap, isMobile: false, isDesktop: true },
  { href: '/community', label: 'Forum', icon: MessageSquare, isMobile: false, isDesktop: true },
];
