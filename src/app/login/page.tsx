
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (user) {
    router.push('/profile');
    return null;
  }

  const handleAuthAction = async (values: z.infer<typeof formSchema>) => {
    if (!auth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
        return;
    }

    setIsLoading(true);
    try {
        if (isSigningUp) {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            toast({ title: 'Success', description: 'Account created successfully! You are now logged in.' });
        } else {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast({ title: 'Success', description: 'Logged in successfully.' });
        }
        router.push('/profile');
    } catch (error: any) {
        const errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'This email is already in use. Please try logging in.';
        } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please try again.';
        } else {
            errorMessage = `An error occurred: ${errorMessage}`;
        }

        toast({ variant: 'destructive', title: 'Authentication Failed', description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                <LogIn className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl">{isSigningUp ? 'Create an Account' : 'Welcome Back!'}</CardTitle>
            <CardDescription>
              {isSigningUp ? 'Fill in your details to join the community.' : 'Sign in to access your profile and the community forum.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAuthAction)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSigningUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsSigningUp(!isSigningUp)}>
                    {isSigningUp ? 'Sign In' : 'Sign Up'}
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
