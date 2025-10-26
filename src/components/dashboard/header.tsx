import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="px-6 py-8">
      <div className="mx-auto max-w-7xl flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
            <Leaf className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold font-headline text-white">
          AgriSmart
        </h1>
      </div>
    </header>
  );
}
