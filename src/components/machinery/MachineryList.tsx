'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tractor } from '../icons/Tractor';

export type UserMachinery = {
  id: string;
  name: string;
  type: string;
  dealer: string;
  location: string;
  hourlyRate: number;
  imageUrl: string;
  imageHint: string;
  features: string[];
  phone: string;
};

interface MachineryListProps {
  machinery: UserMachinery[];
}

export function MachineryList({ machinery }: MachineryListProps) {
  if (machinery.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 rounded-lg border-2 border-dashed h-96">
        <Tractor className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">No Machinery Found</h3>
        <p className="text-muted-foreground">Try adjusting your search filters or location.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {machinery.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint={item.imageHint}
            />
             <Badge className="absolute top-2 right-2">{item.type}</Badge>
          </div>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.dealer}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
             <div className="flex flex-wrap gap-2">
                {item.features?.map((feature) => (
                    <Badge key={feature} variant="outline">{feature}</Badge>
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-secondary/30 p-4">
            <div>
              <p className="text-lg font-bold">₹{item.hourlyRate}</p>
              <p className="text-xs text-muted-foreground">per hour</p>
            </div>
            <Link href={`tel:${item.phone}`}>
              <Button>
                <Phone className="w-4 h-4 mr-2" />
                Contact Dealer
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
