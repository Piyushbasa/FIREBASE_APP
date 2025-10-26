import { Header } from '@/components/dashboard/header';

export default function MarketPage() {
  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">Market Prices</h1>
          <p className="text-muted-foreground">Live mandi rates + sell option coming soon.</p>
        </div>
      </main>
    </div>
  );
}
