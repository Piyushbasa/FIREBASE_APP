import { Header } from '@/components/dashboard/header';

export default function LearnPage() {
  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">Learning Center</h1>
          <p className="text-muted-foreground">Tutorials, tips, and government schemes coming soon.</p>
        </div>
      </main>
    </div>
  );
}
