
import { Leaf } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

export function Header({ rightContent }: { rightContent?: React.ReactNode }) {
  return (
    <header className="p-4 bg-background/80 backdrop-blur-lg sticky top-0 z-40 border-b md:hidden">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-1.5 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground">
              AgriSmart
            </h1>
        </div>
        <div className='flex items-center gap-2'>
            <ThemeToggle />
            {rightContent}
        </div>
      </div>
    </header>
  );
}
