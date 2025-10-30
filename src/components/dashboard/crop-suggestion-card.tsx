"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BrainCircuit, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchCropSuggestion } from "@/app/actions";
import type { SuggestCropOutput } from "@/ai/flows/suggest-crop";

const FormSchema = z.object({
  location: z.string().min(2, { message: "Location is required." }),
  soilType: z.string().min(1, { message: "Soil type is required." }),
  season: z.string().min(1, { message: "Season is required." }),
  temperature: z.string().min(1, { message: "Temperature is required." }),
  fieldLength: z.coerce.number().optional(),
  fieldWidth: z.coerce.number().optional(),
});

export function CropSuggestionCard({ defaultLocation, userLanguage }: { defaultLocation?: string; userLanguage?: string; }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<SuggestCropOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: defaultLocation || "",
      soilType: "Loam",
      season: "Summer",
      temperature: "25°C",
      fieldLength: undefined,
      fieldWidth: undefined,
    },
  });

  React.useEffect(() => {
    if (defaultLocation) {
      form.setValue("location", defaultLocation);
    }
  }, [defaultLocation, form]);


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    const result = await fetchCropSuggestion({
      ...data,
      language: userLanguage || 'English',
    });

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setSuggestion(result.data);
    }
    setIsLoading(false);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          AI Crop Suggester
        </CardTitle>
        <CardDescription>Get AI-powered crop recommendations for your field.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pune, Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Alluvial">Alluvial</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Red and Yellow">Red and Yellow</SelectItem>
                          <SelectItem value="Laterite">Laterite</SelectItem>
                          <SelectItem value="Arid">Arid</SelectItem>
                          <SelectItem value="Saline">Saline</SelectItem>
                          <SelectItem value="Peaty">Peaty</SelectItem>
                          <SelectItem value="Forest">Forest</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Kharif (Monsoon)">Kharif (Monsoon)</SelectItem>
                          <SelectItem value="Rabi (Winter)">Rabi (Winter)</SelectItem>
                          <SelectItem value="Zaid (Summer)">Zaid (Summer)</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 25°C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-sm">Field Dimensions (Optional)</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="fieldLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Length (meters)" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fieldWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Width (meters)" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
          </form>
        </Form>
        
        {isLoading && (
          <div className="mt-6 flex justify-center items-center flex-col gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Our AI is thinking of the perfect crops... <br/>This may take a moment.</p>
          </div>
        )}

        {suggestion && (
          <div className="mt-6 space-y-4">
            <h3 className="text-base font-semibold text-primary">AI Recommendations</h3>
            <div className="space-y-3">
              {suggestion.suggestedCrops.map((crop, index) => (
                <div key={index} className="p-3 rounded-md border bg-secondary/50">
                  <p className="font-semibold">{crop.name}</p>
                  <p className="text-sm text-muted-foreground">{crop.reasoning}</p>
                </div>
              ))}
            </div>
            <div>
                <h4 className="font-semibold text-primary">Planting Advice</h4>
                <p className="text-sm text-muted-foreground">{suggestion.plantingAdvice}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
