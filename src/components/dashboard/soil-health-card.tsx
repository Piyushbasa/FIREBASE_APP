import { Card, CardContent } from '@/components/ui/card';
import { Sprout } from 'lucide-react';

export function SoilHealthCard() {
  return (
    <Card className="bg-secondary border-0">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="bg-white p-2 rounded-lg">
           <Sprout className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
            <p className="text-lg font-bold">Good</p>
            <p className="text-sm text-muted-foreground">pH 7.0</p>
            <p className="text-sm text-muted-foreground">Moisture 20%</p>
        </div>
      </CardContent>
    </Card>
  );
}
