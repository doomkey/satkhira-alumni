"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortKey = "name" | "session" | "profession" | "upazilla" | "faculty";
type FilterKey = SortKey | "";

interface FilterControlsProps {
  currentFilterKey: FilterKey;
  currentFilterValue: string;
  validKeys: SortKey[];
  options: string[];
  onFilterKeyChange: (key: FilterKey) => void;
  onFilterValueChange: (value: string) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function FilterControls({
  currentFilterKey,
  currentFilterValue,
  validKeys,
  options,
  onFilterKeyChange,
  onFilterValueChange,
}: FilterControlsProps) {
  const NONE_KEY_VALUE = "none-key";
  const NONE_VALUE = "none-value";

  const handleClearFilter = () => {
    onFilterKeyChange("");
    onFilterValueChange("");
  };

  const handleFilterKeyChange = (value: string) => {
    if (value === NONE_KEY_VALUE) {
      handleClearFilter();
    } else {
      onFilterKeyChange(value as FilterKey);
    }
  };

  const handleFilterValueChangeSelect = (value: string) => {
    if (value === NONE_VALUE) {
      onFilterValueChange("");
    } else {
      onFilterValueChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Filter By:</span>

      <Select
        value={currentFilterKey || NONE_KEY_VALUE}
        onValueChange={handleFilterKeyChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Key" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_KEY_VALUE} className="text-muted-foreground">
            None
          </SelectItem>
          {validKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {capitalize(key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentFilterValue || NONE_VALUE}
        onValueChange={handleFilterValueChangeSelect}
        disabled={!currentFilterKey}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE} className="text-muted-foreground">
            All {capitalize(currentFilterKey || "")}
          </SelectItem>

          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentFilterKey || currentFilterValue ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearFilter}
          className="h-8 w-8 text-muted-foreground hover:bg-transparent"
          aria-label="Clear Filter"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
