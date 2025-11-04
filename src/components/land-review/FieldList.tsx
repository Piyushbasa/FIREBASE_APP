
'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { Map, Ruler, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export type UserField = {
  id: string;
  fieldName: string;
  fieldSize: number;
  vegetationIndex: number;
  moistureLevel: number;
  imageUrl: string;
  createdAt: Timestamp;
};

interface FieldListProps {
  fields: UserField[] | null;
  isLoading: boolean;
  selectedField: UserField | null;
  onSelectField: (field: UserField) => void;
}

export function FieldList({ fields, isLoading, selectedField, onSelectField }: FieldListProps) {

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center p-4 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">You haven't added any fields yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-2 pr-4">
        {fields.map(field => (
          <button
            key={field.id}
            onClick={() => onSelectField(field)}
            className={cn(
              'w-full text-left p-3 rounded-lg border transition-colors',
              selectedField?.id === field.id
                ? 'bg-primary/10 border-primary'
                : 'bg-card hover:bg-muted/50'
            )}
          >
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-semibold">{field.fieldName}</h4>
                    <p className="text-xs text-muted-foreground">
                        Added {field.createdAt ? formatDistanceToNow(field.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium flex items-center justify-end gap-1"><Ruler size={12}/> {field.fieldSize} acres</p>
                    <p className="text-xs text-green-500 flex items-center justify-end gap-1"><Sparkles size={12}/> {field.vegetationIndex.toFixed(2)} NDVI</p>
                </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

    