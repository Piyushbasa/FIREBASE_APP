
"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from "lucide-react";

export function LocationSelector() {
  const [selectedCity, setSelectedCity] = React.useState("Bulandshahr");

  return (
    <div className="rounded-lg bg-secondary p-1">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full border-0 bg-secondary focus:ring-0">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <SelectValue placeholder="Select a city" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Bulandshahr">Bulandshahr</SelectItem>
                <SelectItem value="Meerut">Meerut</SelectItem>
                <SelectItem value="Ghaziabad">Ghaziabad</SelectItem>
            </SelectContent>
        </Select>
    </div>
  );
}
