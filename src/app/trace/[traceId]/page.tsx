
'use client';
import * as React from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Loader2, Package, Calendar, MapPin, Anchor, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TraceEvent = {
    eventName: string;
    date: Timestamp;
    notes?: string;
    latitude?: number;
    longitude?: number;
};

type ProductTrace = {
    productName: string;
    batchId: string;
    harvestDate: Timestamp;
    userId: string;
    events: TraceEvent[];
};

export default function TraceViewerPage({ params }: { params: { traceId: string } }) {
    const firestore = useFirestore();
    
    // The public trace document is now in the root `traces` collection.
    // This is a stable reference, so we can use useMemoFirebase directly.
    const traceRef = useMemoFirebase(() => {
        if (!firestore || !params.traceId) return null;
        return doc(firestore, 'traces', params.traceId);
    }, [firestore, params.traceId]);

    const { data: trace, isLoading, error } = useDoc<ProductTrace>(traceRef);

    if (isLoading) {
        return (
            <main className="flex-1 flex items-center justify-center p-4 min-h-screen bg-secondary">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Searching for product history...</p>
                </div>
            </main>
        );
    }
    
    if (error || !trace) {
        return (
            <main className="flex-1 flex items-center justify-center p-4 min-h-screen bg-secondary">
                 <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">Trace Not Found</CardTitle>
                        <CardDescription>
                            The traceability log for this product could not be found. Please check the ID and try again.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                         <Link href="/">
                            <Button>Go to Homepage</Button>
                         </Link>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const sortedEvents = trace.events.sort((a, b) => a.date.toMillis() - b.date.toMillis());

    return (
        <main className="flex-1 p-4 min-h-screen bg-secondary">
            <div className="mx-auto max-w-2xl space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
                            <Package className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">{trace.productName}</CardTitle>
                        <CardDescription>
                            Batch ID: <span className="font-mono bg-muted p-1 rounded">{trace.batchId}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center gap-2 p-3 rounded-lg bg-muted">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <span className="font-semibold">Harvested on: {format(trace.harvestDate.toDate(), 'PPP')}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10" />
                    <div className="space-y-8">
                        {sortedEvents.map((event, index) => (
                            <div key={index} className="flex items-start gap-4">
                                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-4 ring-background">
                                    <Anchor className="w-4 h-4" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{event.eventName}</p>
                                    <p className="text-sm text-muted-foreground">{format(event.date.toDate(), 'PPP, p')}</p>
                                    {event.notes && (
                                        <div className="mt-2 flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50 border">
                                            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                            <span>{event.notes}</span>
                                        </div>
                                    )}
                                    {event.latitude && event.longitude && (
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <MapPin className="w-4 h-4"/> View Location
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
