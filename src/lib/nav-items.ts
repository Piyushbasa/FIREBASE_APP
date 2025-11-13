import { BarChart2, Bot, GraduationCap, Home, MessageSquare, User, Wrench, Satellite, Wallet, PackageSearch, Globe } from 'lucide-react';
import { Tractor } from '@/components/icons/Tractor';

export const navItems = [
  { href: '/', label: 'Home', icon: Home, isMobile: true, isDesktop: true },
  { href: '/market', label: 'Market', icon: BarChart2, isMobile: true, isDesktop: true },
  { href: '/tools', label: 'Tools', icon: Wrench, isMobile: true, isDesktop: true },
  { href: '/earth-observer', label: 'Observer', icon: Globe, isMobile: true, isDesktop: true },
  { href: '/profile', label: 'Profile', icon: User, isMobile: true, isDesktop: true },
  { href: '/finance', label: 'Finance', icon: Wallet, isMobile: false, isDesktop: true },
  { href: '/machinery', label: 'Machinery', icon: Tractor, isMobile: false, isDesktop: true },
  { href: '/satellite', label: 'Satellite', icon: Satellite, isMobile: false, isDesktop: true },
  { href: '/traceability', label: 'Traceability', icon: PackageSearch, isMobile: false, isDesktop: true },
  { href: '/assistant', label: 'Assistant', icon: Bot, isMobile: false, isDesktop: true },
  { href: '/learn', label: 'Learn', icon: GraduationCap, isMobile: false, isDesktop: true },
  { href: '/community', label: 'Forum', icon: MessageSquare, isMobile: false, isDesktop: true },
];
