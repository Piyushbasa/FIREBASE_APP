
import { Card, CardContent } from '@/components/ui/card';
import { Wheat } from 'lucide-react';

export function CropInfoCard() {
  return (
    <Card className="bg-secondary border-0">
      <CardContent className="p-4 flex items-center gap-4">
         <div className="bg-white p-2 rounded-lg">
            <Wheat className="w-8 h-8 text-primary" />
         </div>
        <div>
          <p className="font-bold text-lg">Wheat</p>
          <div className="flex gap-4">
            <p className="text-sm text-muted-foreground">Sowing: Dec</p>
            <p className="text-sm text-muted-foreground">Harvest: Apr</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
