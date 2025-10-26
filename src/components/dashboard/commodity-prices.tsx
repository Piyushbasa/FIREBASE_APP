"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { fetchCommodityPrices } from "@/app/actions";
import type { CommodityPricesOutput } from "@/ai/flows/commodity-price-tracking";

const commodities = [
  { id: "rice", label: "Rice" },
  { id: "corn", label: "Corn" },
  { id: "grapes", label: "Grapes" },
  { id: "potatoes", label: "Potatoes" },
  { id: "olives", label: "Olives" },
] as const;

const FormSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  commodities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one commodity.",
  }),
});

export function CommodityPrices() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [priceData, setPriceData] = React.useState<CommodityPricesOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
      commodities: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setPriceData(null);
    const result = await fetchCommodityPrices(data);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setPriceData(result.data);
    }
    setIsLoading(false);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Commodity Price Tracker</CardTitle>
        <CardDescription>Get location-specific prices for key commodities powered by AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fresno, California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commodities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Commodities</FormLabel>
                    <FormDescription>Select the commodities you want to track.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {commodities.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="commodities"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Prices
            </Button>
          </form>
        </Form>
        
        {isLoading && (
          <div className="mt-6 flex justify-center items-center flex-col gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Our AI is analyzing the markets... <br/>This may take a moment.</p>
          </div>
        )}

        {priceData && priceData.prices.length > 0 && (
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-2">Price Results for {form.getValues('location')}</h3>
            <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceData.prices.map((price) => (
                  <TableRow key={price.commodity}>
                    <TableCell className="font-medium capitalize">{price.commodity}</TableCell>
                    <TableCell className="text-right">{`${price.price} / ${price.unit}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
