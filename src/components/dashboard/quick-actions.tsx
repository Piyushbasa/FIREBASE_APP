
import { Button } from '@/components/ui/button';
import { Sun, BarChart2 } from 'lucide-react';

export function QuickActions() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" className="h-16 flex-col items-start justify-between p-4">
            <Sun className="w-6 h-6 text-primary" />
            <span className="self-start font-semibold">Weather</span>
        </Button>
        <Button variant="secondary" className="h-16 flex-col items-start justify-between p-4">
            <BarChart2 className="w-6 h-6 text-primary" />
            <span className="self-start font-semibold">Market Prices</span>
        </Button>
      </div>
    </div>
  );
}
