import { Header } from '@/components/dashboard/header';

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <main className="flex-1 bg-card rounded-t-[2rem] p-6">
        <h1 className="text-3xl font-bold">Tools</h1>
        <p className="text-muted-foreground">Smart Tools — IoT sensor data, irrigation, fertilizer schedule coming soon.</p>
      </main>
    </div>
  );
}
