
import { ThemeToggle } from '../theme-toggle';

export function Header({ rightContent }: { rightContent?: React.ReactNode }) {
  return (
    <header className="p-4 bg-background/80 backdrop-blur-lg sticky top-0 z-40 border-b md:hidden">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M11 20A7 7 0 0 1 4 13H2a2 2 0 1 0-4 0h2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z M4 13c0-4.5 3-5.5 3-5.5s3 .5 3 5.5c0 .4 0 .8.1 1.2M17 12v.5A2.5 2.5 0 0 0 19.5 15h0A2.5 2.5 0 0 0 22 12.5V12a3 3 0 0 0-3-3 3 3 0 0 0-3 3Z"></path></svg>
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
