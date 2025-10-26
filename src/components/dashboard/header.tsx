import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="px-4 sm:px-6 md:px-8 py-4 border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center gap-3">
        <Leaf className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-white">
          AgriAssist
        </h1>
      </div>
    </header>
  );
}
