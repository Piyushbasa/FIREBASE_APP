
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MarketPricesCard() {
  return (
    <Card className="bg-secondary border-0">
        <CardHeader>
            <CardTitle className="text-xl">Market Prices</CardTitle>
            <CardDescription>Mandi rates</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="font-semibold">Wheat</p>
                <p className="font-semibold text-lg">₹1,850 <span className="text-sm font-normal text-muted-foreground">per quintal</span></p>
            </div>
            <div className="flex justify-between items-center">
                <p className="font-semibold">Rice</p>
                <p className="font-semibold text-lg">₹2,200 <span className="text-sm font-normal text-muted-foreground">per quintal</span></p>
            </div>
        </div>
        <Button className="w-full mt-6 bg-primary text-primary-foreground">Sell</Button>
      </CardContent>
    </Card>
  );
}
