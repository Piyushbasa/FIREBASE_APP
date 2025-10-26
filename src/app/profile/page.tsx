import { Header } from '@/components/dashboard/header';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <main className="flex-1 bg-card rounded-t-[2rem] p-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">User profile page coming soon.</p>
      </main>
    </div>
  );
}
