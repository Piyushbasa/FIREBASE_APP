import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="mx-auto max-w-7xl flex items-center gap-3">
        <div className="bg-primary/20 p-1.5 rounded-lg">
            <Leaf className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold font-headline text-foreground">
          AgriSmart
        </h1>
      </div>
    </header>
  );
}
