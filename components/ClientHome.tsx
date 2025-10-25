"use client";

import { useState, useMemo } from "react";
import AlumniCard from "@/components/AlumniCard";
import SortControls from "@/components/SortControls";
import FilterControls from "@/components/FilterControls";
import { Alumni } from "@/app/page";
import { AlumniRecord } from "@/lib/types";

type SortKey = "name" | "session" | "profession" | "upazilla" | "faculty";
type Order = "asc" | "desc";
type FilterKey = SortKey | "";

const VALID_SORT_KEYS: SortKey[] = [
  "name",
  "session",
  "profession",
  "upazilla",
  "faculty",
];

const VALID_FILTER_KEYS: SortKey[] = [
  "session",
  "profession",
  "upazilla",
  "faculty",
];

const PRIORITY_KEYS: SortKey[] = ["session", "profession"];

interface ClientHomeProps {
  initialAlumni: AlumniRecord[];
}

const getUniqueOptions = (alumni: AlumniRecord[], key: SortKey): string[] => {
  const options = new Set<string>();
  alumni.forEach((a) => {
    const value = String(a[key as keyof AlumniRecord]);
    if (value) {
      options.add(value);
    }
  });
  return Array.from(options).sort((a, b) => a.localeCompare(b));
};

export default function ClientHome({ initialAlumni }: ClientHomeProps) {
  // Sorting State
  const [sortBy, setSortBy] = useState<SortKey>("profession");
  const [order, setOrder] = useState<Order>("asc");

  // Filtering State
  const [filterKey, setFilterKey] = useState<FilterKey>("");
  const [filterValue, setFilterValue] = useState<string>("");

  const filterOptions = useMemo(() => {
    if (!filterKey) return {};

    const options = getUniqueOptions(initialAlumni, filterKey as SortKey);
    return { [filterKey]: options };
  }, [initialAlumni, filterKey]);

  const processedAlumni = useMemo(() => {
    if (!initialAlumni || initialAlumni.length === 0) {
      return [];
    }

    let filtered = initialAlumni;

    if (filterKey && filterValue) {
      filtered = initialAlumni.filter((alumnus) => {
        const alumnusValue = String(alumnus[filterKey as keyof Alumni]);
        return alumnusValue === filterValue;
      });
    }

    const compare = (a: any, b: any, sortOrder: Order) => {
      const valA = String(a).toLowerCase();
      const valB = String(b).toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    };

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = compare(a.name, b.name, order);
        if (comparison !== 0) return comparison;
      } else {
        comparison = compare(a[sortBy], b[sortBy], order);
        if (comparison !== 0) return comparison;

        for (const key of PRIORITY_KEYS) {
          if (key === sortBy) continue;
          comparison = compare(a[key], b[key], order);
          if (comparison !== 0) return comparison;
        }
      }
      return 0;
    });

    return sorted;
  }, [initialAlumni, sortBy, order, filterKey, filterValue]);

  const handleSortByChange = (key: SortKey) => setSortBy(key);
  const handleOrderToggle = () => setOrder(order === "asc" ? "desc" : "asc");

  const handleFilterKeyChange = (key: FilterKey) => {
    setFilterKey(key);
    setFilterValue("");
  };

  const handleFilterValueChange = (value: string) => setFilterValue(value);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <FilterControls
          currentFilterKey={filterKey}
          currentFilterValue={filterValue}
          validKeys={VALID_FILTER_KEYS}
          options={filterOptions[filterKey as SortKey] || []}
          onFilterKeyChange={handleFilterKeyChange}
          onFilterValueChange={handleFilterValueChange}
        />
        <SortControls
          currentSortBy={sortBy}
          currentOrder={order}
          validKeys={VALID_SORT_KEYS}
          onSortByChange={handleSortByChange}
          onOrderToggle={handleOrderToggle}
        />
      </div>

      {processedAlumni.length === 0 ? (
        <p>No alumni found matching the current filters.</p>
      ) : (
        <div className="space-y-4">
          {processedAlumni.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      )}
    </>
  );
}
