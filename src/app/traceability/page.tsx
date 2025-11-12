
'use client';
import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, PackageSearch, Calendar as CalendarIcon, Share2, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useMemoFirebase } from '@/firebase/provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

const eventSchema = z.object({
    eventName: z.string().min(2, 'Event name is required.'),
    date: z.date(),
    notes: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

const formSchema = z.object({
  productName: z.string().min(2, 'Product name is required.'),
  batchId: z.string().min(2, 'Batch ID is required.'),
  harvestDate: z.date(),
  events: z.array(eventSchema),
});

type ProductTrace = {
    id: string;
    productName: string;
    batchId: string;
    harvestDate: Timestamp;
}

export default function TraceabilityPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isLoading, setIsLoading] = React.useState(false);

    const tracesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `userProfile/${user.uid}/traces`), where('userId', '==', user.uid));
    }, [firestore, user]);

    const { data: traces, isLoading: areTracesLoading } = useCollection<ProductTrace>(tracesQuery);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: '',
            batchId: '',
            harvestDate: new Date(),
            events: [{ eventName: 'Sowing', date: new Date(), notes: '' }],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "events",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user || !firestore) return;
        setIsLoading(true);

        const traceData = {
            ...values,
            userId: user.uid,
            harvestDate: Timestamp.fromDate(values.harvestDate),
            events: values.events.map(e => ({
                ...e,
                date: Timestamp.fromDate(e.date),
            })),
        };

        addDocumentNonBlocking(collection(firestore, `userProfile/${user.uid}/traces`), traceData);

        toast({
            title: 'Traceability Log Created',
            description: `Log for ${values.productName} (Batch: ${values.batchId}) has been saved.`,
        });
        
        form.reset();
        setIsLoading(false);
    };

    const handleShare = (traceId: string) => {
        const url = `${window.location.origin}/trace/${traceId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: 'Link Copied!',
            description: 'The shareable link for this trace has been copied to your clipboard.',
        });
    }

    const fetchLocation = (index: number) => {
        if (!navigator.geolocation) {
            toast({
                variant: "destructive",
                title: "Geolocation not supported",
                description: "Your browser does not support geolocation.",
            });
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const currentEvent = form.getValues(`events.${index}`);
                update(index, { ...currentEvent, latitude, longitude });
                toast({
                    title: "Location Added",
                    description: `Coordinates captured for event: ${currentEvent.eventName}`,
                });
            },
            () => {
                toast({
                    variant: "destructive",
                    title: "Unable to retrieve location",
                    description: "Please ensure location services are enabled.",
                });
            }
        );
    };

    if (isUserLoading) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header rightContent={<SidebarTrigger />} />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </main>
            </div>
        );
    }
    
    if (!user) {
         return (
             <div className="flex flex-col min-h-screen">
                <Header rightContent={<SidebarTrigger />} />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center p-8 border rounded-lg bg-card max-w-md">
                        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                        <p className="text-muted-foreground mb-4">You must be logged in to manage traceability logs.</p>
                        <Link href="/login">
                            <Button>Login or Sign Up</Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }


    return (
        <div className="flex flex-col min-h-screen">
            <Header rightContent={<SidebarTrigger />} />
            <main className="flex-1 p-4">
                <div className="mx-auto max-w-4xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PackageSearch className="w-6 h-6 text-primary" />
                                Product Traceability
                            </CardTitle>
                            <CardDescription>
                                Create a digital log for your produce from farm to fork to build trust with consumers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="productName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Name</FormLabel>
                                                    <FormControl><Input placeholder="e.g., Organic Basmati Rice" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="batchId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Batch ID</FormLabel>
                                                    <FormControl><Input placeholder="e.g., B-1024" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="harvestDate"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Harvest Date</FormLabel>
                                                <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                         <FormLabel>Traceability Events</FormLabel>
                                         {fields.map((field, index) => (
                                            <div key={field.id} className="space-y-2 p-3 border rounded-lg">
                                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                                                    <FormField control={form.control} name={`events.${index}.eventName`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Event</FormLabel><FormControl><Input placeholder="e.g., Sowing" {...field} /></FormControl></FormItem> )} />
                                                    <FormField control={form.control} name={`events.${index}.date`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal text-xs",!field.value && "text-muted-foreground")}><small>{field.value ? format(field.value, "PP") : "Pick a date"}</small><CalendarIcon className="ml-auto h-3 w-3 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem> )} />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                                </div>
                                                 <FormField control={form.control} name={`events.${index}.notes`} render={({ field }) => ( <FormItem><FormLabel className="text-xs">Notes</FormLabel><FormControl><Input placeholder="Organic fertilizer used" {...field} /></FormControl></FormItem> )} />
                                                <div className="flex items-center justify-between pt-2">
                                                    {field.latitude && field.longitude ? (
                                                        <div className="text-xs text-muted-foreground">
                                                            Lat: {field.latitude.toFixed(4)}, Lon: {field.longitude.toFixed(4)}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-muted-foreground italic">No location added</div>
                                                    )}
                                                    <Button type="button" variant="outline" size="sm" onClick={() => fetchLocation(index)}>
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        Add Location
                                                    </Button>
                                                </div>
                                            </div>
                                         ))}
                                         <Button type="button" variant="outline" size="sm" onClick={() => append({ eventName: '', date: new Date(), notes: '' })}><Plus className="mr-2 h-4 w-4" /> Add Event</Button>
                                    </div>
                                    
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageSearch className="mr-2"/>}
                                        Create Traceability Log
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Traceability Logs</CardTitle>
                            <CardDescription>View and share your existing product logs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {areTracesLoading ? (
                                <div className="flex justify-center items-center h-24">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                             ) : traces && traces.length > 0 ? (
                                <ScrollArea className="h-64">
                                    <div className="space-y-2 pr-4">
                                        {traces.map(trace => (
                                            <div key={trace.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-semibold">{trace.productName}</p>
                                                    <p className="text-sm text-muted-foreground">Batch: {trace.batchId} | Harvested: {format(trace.harvestDate.toDate(), "PPP")}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => handleShare(trace.id)}>
                                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                             ) : (
                                 <div className="text-center p-8 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">You haven't created any traceability logs yet.</p>
                                </div>
                             )}
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
