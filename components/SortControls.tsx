"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

type SortKey = "name" | "session" | "profession" | "upazilla" | "faculty";
type Order = "asc" | "desc";

interface SortControlsProps {
  currentSortBy: SortKey;
  currentOrder: Order;
  validKeys: SortKey[];
  onSortByChange: (key: SortKey) => void;
  onOrderToggle: () => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function SortControls({
  currentSortBy,
  currentOrder,
  validKeys,
  onSortByChange,
  onOrderToggle,
}: SortControlsProps) {
  const handleSortByChange = (value: string) => {
    onSortByChange(value as SortKey);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Sort By:</span>

      <Select value={currentSortBy} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {validKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {capitalize(key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={onOrderToggle}
        aria-label={`Toggle sort order to ${
          currentOrder === "asc" ? "descending" : "ascending"
        }`}
      >
        {currentOrder === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
