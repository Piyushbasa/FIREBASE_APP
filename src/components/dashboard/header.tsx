import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="px-4 sm:px-6 md:px-8 py-4 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl flex items-center gap-3">
        <Leaf className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          AgriAssist
        </h1>
      </div>
    </header>
  );
}
