import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Upload } from 'lucide-react';

export function FieldMonitoringCard() {
  const fieldImages = PlaceHolderImages.filter(img => img.id.startsWith('field-'));

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Field Monitoring</CardTitle>
        <CardDescription>Real-time status of your fields</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-4">
        {fieldImages.length > 0 ? (
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {fieldImages.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          width={600}
                          height={400}
                          className="object-cover w-full h-full"
                          data-ai-hint={image.imageHint}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        ) : (
          <p className="text-muted-foreground">No images to display.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload Image or Connect Satellite
        </Button>
      </CardFooter>
    </Card>
  );
}
