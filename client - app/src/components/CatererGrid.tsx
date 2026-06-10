"use client";

import { useMemo, useState } from "react";
import type { Caterer } from "@/types/caterer";
import CatererCard from "./CatererCard";
import SearchBar from "./SearchBar";

interface CatererGridProps {
  caterers: Caterer[];
  categories?: { id: string; name: string; slug: string }[];
}

export default function CatererGrid({ caterers, categories = [] }: CatererGridProps) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const cat = category.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    return caterers.filter((caterer) => {
      const matchesName =
        !query ||
        caterer.name.toLowerCase().includes(query) ||
        caterer.cuisines.some((cu) => cu.toLowerCase().includes(query));
      const matchesLocation = !loc || caterer.location.toLowerCase().includes(loc);
      const matchesMin = min === null || caterer.pricePerPlate >= min;
      const matchesMax = max === null || caterer.pricePerPlate <= max;

      if (cat) {
        const matchedCatIds = categories
          .filter((ct) => ct.name.toLowerCase().includes(cat))
          .map((ct) => ct.id);
        if (matchedCatIds.length > 0) {
          return (
            matchesName &&
            matchesLocation &&
            (caterer.categoryIds?.some((id) => matchedCatIds.includes(id)) ?? false) &&
            matchesMin &&
            matchesMax
          );
        }
      }

      return matchesName && matchesLocation && matchesMin && matchesMax;
    });
  }, [caterers, search, location, category, minPrice, maxPrice, categories]);

  const hasActiveFilters = Boolean(search || location || category || minPrice || maxPrice);

  function clearFilters() {
    setSearch("");
    setLocation("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="relative space-y-6">
      <SearchBar
        search={search}
        location={location}
        category={category}
        onSearchChange={setSearch}
        onLocationChange={setLocation}
        onCategoryChange={setCategory}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-stone-200/60 bg-white px-5 py-4">
        <div className="min-w-[120px] flex-1">
          <label htmlFor="minPrice" className="mb-1 block text-xs font-medium text-stone-500">
            Min price (₹)
          </label>
          <input
            id="minPrice"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <div className="min-w-[120px] flex-1">
          <label htmlFor="maxPrice" className="mb-1 block text-xs font-medium text-stone-500">
            Max price (₹)
          </label>
          <input
            id="maxPrice"
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <p className="w-full text-sm text-stone-600 sm:w-auto sm:ml-auto">
          <span className="font-semibold text-stone-900">{filtered.length}</span> of{" "}
          <span className="font-semibold text-stone-900">{caterers.length}</span> caterers
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <span className="mb-4 text-4xl">🔍</span>
          <h3 className="text-lg font-semibold text-stone-900">No caterers found</h3>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            Try different search terms, location, or category filters.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="interactive mt-6 rounded-full bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caterer, index) => (
            <CatererCard key={caterer.id} caterer={caterer} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
