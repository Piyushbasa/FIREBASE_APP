"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { fetchCommodityPrices } from "@/app/actions";
import type { CommodityPricesOutput } from "@/ai/flows/commodity-price-tracking";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";

const commodities = [
  { id: "arhar (tur/red gram)", label: "Arhar (Tur/Red Gram)" },
  { id: "bajra (pearl millet)", label: "Bajra (Pearl Millet)" },
  { id: "barley (jau)", label: "Barley (Jau)" },
  { id: "bengal gram dal (chana dal)", label: "Bengal Gram Dal (Chana Dal)" },
  { id: "black gram (urad dal)", label: "Black Gram (Urad Dal)" },
  { id: "castor seed", label: "Castor Seed" },
  { id: "coriander", label: "Coriander" },
  { id: "cotton", label: "Cotton" },
  { id: "ginger", label: "Ginger" },
  { id: "gram", label: "Gram" },
  { id: "green gram (moong)", label: "Green Gram (Moong)" },
  { id: "groundnut", label: "Groundnut" },
  { id: "guar seed", label: "Guar Seed" },
  { id: "jowar (sorghum)", label: "Jowar (Sorghum)" },
  { id: "lentil (masur)", label: "Lentil (Masur)" },
  { id: "linseed", label: "Linseed" },
  { id: "maize", label: "Maize (Corn)" },
  { id: "mustard", label: "Mustard" },
  { id: "paddy (dhan)", label: "Paddy (Dhan)" },
  { id: "ragi (finger millet)", label: "Ragi (Finger Millet)" },
  { id: "rapeseed & mustard", label: "Rapeseed & Mustard" },
  { id: "rice", label: "Rice" },
  { id: "safflower", label: "Safflower" },
  { id: "sesamum (sesame)", label: "Sesamum (Sesame)" },
  { id: "soyabean", label: "Soyabean" },
  { id: "sugarcane", label: "Sugarcane" },
  { id: "sunflower", label: "Sunflower" },
  { id: "wheat", label: "Wheat" },
  { id: "grapes", label: "Grapes" },
  { id: "potatoes", label: "Potatoes" },
  { id: "olives", label: "Olives" },
] as const;


const FormSchema = z.object({
  commodities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one commodity.",
  }),
  location: z.string().min(1, { message: "Location is required." }),
});

export function CommodityPrices() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [priceData, setPriceData] = React.useState<CommodityPricesOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      commodities: [],
      location: "Odisha"
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Commodity Price Tracker</CardTitle>
        <CardDescription>Get prices for key commodities from markets across India.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Odisha or all India" {...field} />
                  </FormControl>
                   <FormDescription>Enter a state or "all India".</FormDescription>
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
                  <ScrollArea className="h-40">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pr-4">
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
                            <FormLabel className="font-normal text-sm">{item.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  </ScrollArea>
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
        
        <div className="flex-grow mt-6">
        {isLoading && (
          <div className="flex justify-center items-center flex-col gap-4 text-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Our AI is analyzing markets... <br/>This may take a moment.</p>
          </div>
        )}

        {priceData && priceData.prices.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-2">Price Results from Indian Markets</h3>
            <ScrollArea className="h-64">
              <div className="rounded-md border pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceData.prices.map((price, index) => (
                    <TableRow key={`${price.commodity}-${index}`}>
                      <TableCell className="font-medium capitalize">{price.commodity}</TableCell>
                      <TableCell>{price.market}</TableCell>
                      <TableCell className="text-right">{`${price.price} / ${price.unit}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </ScrollArea>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
