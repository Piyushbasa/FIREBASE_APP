'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().optional(),
  date: z.date(),
});

export type Transaction = {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Timestamp;
  description?: string;
};

const incomeCategories = ["Crop Sale", "Livestock Sale", "Government Subsidy", "Rental Income", "Other"];
const expenseCategories = ["Seeds", "Fertilizer", "Pesticides", "Labor", "Equipment", "Fuel", "Repairs", "Other"];


export function NewTransactionForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      category: '',
      description: '',
      date: new Date(),
    },
  });

  const handleTabChange = (value: string) => {
    const type = value as 'income' | 'expense';
    setActiveTab(type);
    form.setValue('type', type);
    form.setValue('category', '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    setIsLoading(true);

    try {
      const transactionsCollection = collection(firestore, `userProfile/${user.uid}/transactions`);
      addDocumentNonBlocking(transactionsCollection, {
        ...values,
        userId: user.uid,
        date: Timestamp.fromDate(values.date),
      });
      toast({ title: 'Success', description: 'Transaction added successfully.' });
      form.reset({
        type: activeTab,
        amount: 0,
        category: '',
        description: '',
        date: new Date(),
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add transaction.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const categories = activeTab === 'income' ? incomeCategories : expenseCategories;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
            </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="₹0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Crop Sale, Seeds" list={`${activeTab}-categories`} {...field} />
                </FormControl>
                <datalist id={`${activeTab}-categories`}>
                    {categories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="Add a short note..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Transaction
        </Button>
      </form>
    </Form>
  );
}
