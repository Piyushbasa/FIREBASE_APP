
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
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { setDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');


  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header rightContent={<SidebarTrigger />} />
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

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
        return;
    }
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Success', description: 'Logged in successfully.' });
        router.push('/profile');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Authentication Failed', description: 'Invalid email or password. Please try again.' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    if (!auth || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
        return;
    }
    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const newUser = userCredential.user;
        const userProfileRef = doc(firestore, 'userProfile', newUser.uid);
        await setDoc(userProfileRef, {
          email: newUser.email,
          language: 'English',
          location: '',
        }, { merge: true });
        toast({ title: 'Success', description: 'Account created successfully! You are now logged in.' });
        router.push('/profile');
    } catch (error: any) {
        const errorMessage = error.code === 'auth/email-already-in-use' 
            ? 'This email is already in use. Please sign in instead.' 
            : `An error occurred: ${error.message}`;
        toast({ variant: 'destructive', title: 'Sign Up Failed', description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                <LogIn className="h-12 w-12 text-primary" />
            </div>
             <CardTitle className="mt-4 text-2xl">
                {activeTab === 'login' ? 'Welcome Back!' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'login' ? 'Sign in to access your dashboard.' : 'Fill in your details to join the community.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-4">
                 <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                        control={loginForm.control}
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
                        control={loginForm.control}
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
                            Sign In
                        </Button>
                    </form>
                </Form>
              </TabsContent>
              <TabsContent value="signup" className="pt-4">
                 <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                       <FormField
                        control={signupForm.control}
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
                        control={signupForm.control}
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
                            Sign Up
                        </Button>
                    </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
