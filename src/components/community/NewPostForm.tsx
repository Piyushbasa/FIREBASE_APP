
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  content: z.string().min(10, { message: 'Post must be at least 10 characters long.' }).max(500, { message: 'Post cannot exceed 500 characters.'}),
});

export function NewPostForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to post.' });
        return;
    }
    
    setIsLoading(true);

    try {
        const postsCollection = collection(firestore, 'posts');
        addDocumentNonBlocking(postsCollection, {
            content: values.content,
            authorId: user.uid,
            authorName: user.email || 'Anonymous',
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Your post has been published.'});
        form.reset();
    } catch (error) {
        // This catch block is for client-side errors during form processing,
        // not for Firestore permission errors, which are now handled globally.
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to publish post. Please try again.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="What's on your mind? Ask a question or share an update..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" />}
            Publish Post
        </Button>
      </form>
    </Form>
  );
}
