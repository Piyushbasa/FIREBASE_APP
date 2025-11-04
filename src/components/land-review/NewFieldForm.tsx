
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Loader2, Plus } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  fieldName: z.string().min(3, { message: 'Field name must be at least 3 characters.' }).max(50),
  fieldSize: z.coerce.number().min(0.1, { message: 'Size must be at least 0.1 acres.' }),
});

export function NewFieldForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  // State to hold client-side generated random values
  const [mockData, setMockData] = useState({
    vegetationIndex: 0.75,
    moistureLevel: 60,
  });

  // Generate random values on the client after mount to avoid hydration errors
  useEffect(() => {
    setMockData({
      vegetationIndex: Math.random() * (0.9 - 0.6) + 0.6,
      moistureLevel: Math.floor(Math.random() * (75 - 45 + 1) + 45),
    });
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: '',
      fieldSize: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to add a field.' });
      return;
    }

    setIsLoading(true);

    try {
      const fieldsCollection = collection(firestore, `userProfile/${user.uid}/fields`);
      
      const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
      
      addDocumentNonBlocking(fieldsCollection, {
        userId: user.uid,
        fieldName: values.fieldName,
        fieldSize: values.fieldSize,
        createdAt: serverTimestamp(),
        // Use client-side generated mock data
        imageUrl: randomImage.imageUrl,
        vegetationIndex: mockData.vegetationIndex,
        moistureLevel: mockData.moistureLevel,
      });

      toast({ title: 'Success', description: 'Your new field has been added.' });
      form.reset();
      // Re-generate mock data for the next potential entry
      setMockData({
        vegetationIndex: Math.random() * (0.9 - 0.6) + 0.6,
        moistureLevel: Math.floor(Math.random() * (75 - 45 + 1) + 45),
      });

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add field. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-4">
        <div className="space-y-2">
            <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Field Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., North Paddock" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="fieldSize"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Field Size (Acres)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add New Field
        </Button>
      </form>
    </Form>
  );
}
