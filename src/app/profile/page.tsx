
'use client';

import { Header } from '@/components/dashboard/header';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
              <UserIcon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl">Your Profile</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent>
            {isUserLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : user ? (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">You are signed in as:</p>
                <p className="font-semibold text-lg break-all">{user.email}</p>
                <Button onClick={handleSignOut} variant="destructive" className="w-full">
                  <LogOut className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">You are not signed in.</p>
                <Link href="/login" className="w-full">
                  <Button className="w-full">
                    <LogIn className="mr-2" />
                    Login or Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
