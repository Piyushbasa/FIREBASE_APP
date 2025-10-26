import { Header } from '@/components/dashboard/header';

export default function AssistantPage() {
  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Ask farming questions (voice/text in local language) coming soon.</p>
        </div>
      </main>
    </div>
  );
}
