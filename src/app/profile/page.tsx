
'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, LogOut, User as UserIcon, Save } from 'lucide-react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { SidebarTrigger } from '@/components/ui/sidebar';

type UserProfile = {
  email: string;
  location?: string;
};

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfile', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (userProfile?.location) {
      setLocation(userProfile.location);
    }
  }, [userProfile]);


  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !firestore || !userProfileRef) return;
    setIsSaving(true);
    try {
        const profileData: UserProfile = {
            email: user.email!,
            location: location,
        };
        // Using non-blocking update
        setDocumentNonBlocking(userProfileRef, profileData, { merge: true });
        toast({
            title: 'Profile Updated',
            description: 'Your location has been saved successfully.',
        });
    } catch (error) {
        console.error("Error saving profile:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to save your profile. Please try again.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
              <UserIcon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl">Your Profile</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : user ? (
              <div className="space-y-6">
                <div className='text-center'>
                  <p className="text-sm text-muted-foreground">You are signed in as:</p>
                  <p className="font-semibold text-lg break-all">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g., Pune, Maharashtra" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                  />
                   <p className="text-xs text-muted-foreground">This will be used to personalize your experience.</p>
                </div>

                <div className='space-y-2'>
                    <Button onClick={handleSaveProfile} className="w-full" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
                        Save Preferences
                    </Button>
                    <Button onClick={handleSignOut} variant="destructive" className="w-full">
                        <LogOut className="mr-2" />
                        Sign Out
                    </Button>
                </div>

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
