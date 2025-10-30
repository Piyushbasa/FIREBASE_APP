
'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FlaskConical, Loader2, Info, ShieldAlert } from "lucide-react";

import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchPesticideInfo } from '@/app/actions';
import type { PesticideInfoOutput } from "@/ai/flows/pesticide-info-flow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const FormSchema = z.object({
  crop: z.string().min(2, { message: "Crop name is required." }),
  pestOrDisease: z.string().min(2, { message: "Pest or disease name is required." }),
  fieldArea: z.coerce.number().min(0.1, { message: "Field area must be at least 0.1 acres." }),
});


export default function ToolsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [pesticideInfo, setPesticideInfo] = React.useState<PesticideInfoOutput | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            crop: "",
            pestOrDisease: "",
            fieldArea: 1,
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        setPesticideInfo(null);
        const result = await fetchPesticideInfo(data);

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
        } else {
            setPesticideInfo(result.data);
        }
        setIsLoading(false);
    }

  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-primary" />
                    AI Pesticide Calculator
                </CardTitle>
                <CardDescription>Get AI-powered pesticide recommendations and dosage calculations for your specific needs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="crop"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Crop Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Tomato, Cotton" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pestOrDisease"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pest or Disease</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Aphids, Blight" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="fieldArea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Field Area (in acres)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Recommendations
                        </Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
          
          {isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card border">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="font-semibold">AI is calculating recommendations...</p>
                <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          )}

          {pesticideInfo && pesticideInfo.recommendations.length > 0 && (
            <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">AI Recommendations</h2>
                <Accordion type="single" collapsible defaultValue="item-0">
                    {pesticideInfo.recommendations.map((rec, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="font-semibold text-base hover:no-underline">
                               <div className="flex items-center gap-2">
                                 <span>{rec.pesticideName}</span>
                                 <Badge variant={rec.type === 'Organic' ? 'default' : 'secondary'}>{rec.type}</Badge>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <div className="p-3 rounded-md border bg-secondary/30">
                                    <h4 className="font-semibold text-primary">Chemical Composition</h4>
                                    <p className="text-sm text-muted-foreground">{rec.chemicalName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-3 rounded-md border bg-secondary/30">
                                        <h4 className="font-semibold text-primary">Application Rate</h4>
                                        <p className="text-sm text-muted-foreground">{rec.applicationRate}</p>
                                    </div>
                                    <div className="p-3 rounded-md border bg-secondary/30">
                                        <h4 className="font-semibold text-primary">Total for {form.getValues('fieldArea')} acres</h4>
                                        <p className="text-sm text-muted-foreground font-bold">{rec.totalAmount}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                    <ShieldAlert className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-destructive">Safety Precautions</h4>
                                        <p className="text-sm text-muted-foreground">{rec.safetyPrecautions}</p>
                                    </div>
                                </div>
                            </AccordionContent>
                         </AccordionItem>
                    ))}
                </Accordion>
                <CardFooter className="text-xs text-muted-foreground mt-4 p-0">
                    <Info className="w-4 h-4 mr-2"/>
                    Disclaimer: Always read and follow the manufacturer's label and local regulations. The recommendations provided are for informational purposes only.
                </CardFooter>
            </div>
          )}

           {pesticideInfo && pesticideInfo.recommendations.length === 0 && !isLoading && (
               <div className="mt-6 flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card border">
                  <p className="font-semibold">No specific recommendations found.</p>
                  <p className="text-sm text-muted-foreground">Please try different search terms or consult a local expert.</p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
