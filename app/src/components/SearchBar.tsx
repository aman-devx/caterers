"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchSearchSuggestions } from "@/lib/api";
import AutocompleteInput, { type SuggestionItem } from "./AutocompleteInput";

interface SearchBarProps {
  search: string;
  location: string;
  category: string;
  onSearchChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export default function SearchBar({
  search,
  location,
  category,
  onSearchChange,
  onLocationChange,
  onCategoryChange,
  onClear,
  hasActiveFilters,
}: SearchBarProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSearchSuggestions>> | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const lastQueryRef = useRef("");

  const loadSuggestions = useCallback(async () => {
    const queryKey = `${search}|${location}|${category}`;
    if (queryKey === lastQueryRef.current) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    try {
      const result = await fetchSearchSuggestions(
        { q: search, location, category },
        controller.signal
      );
      if (requestId !== requestIdRef.current) return;
      lastQueryRef.current = queryKey;
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [search, location, category]);

  useEffect(() => {
    const timer = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timer);
  }, [loadSuggestions]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const searchSuggestions = useMemo((): SuggestionItem[] => {
    if (!data) return [];
    const items: SuggestionItem[] = [];
    const seen = new Set<string>();

    data.catererResults?.forEach((c) => {
      const key = `caterer-${c.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({
        type: "caterer",
        label: c.name,
        sublabel: `${c.location} · ${(c.cuisines || []).join(", ")} · ₹${c.pricePerPlate}/plate`,
        value: c.name,
        image: c.coverImage || c.logo,
        rating: c.rating,
        cuisine: (c.cuisines || []).join(", "),
      });
    });

    data.cuisineSuggestions?.forEach((c) => {
      const key = `cuisine-${c}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ type: "cuisine", label: c, value: c, cuisine: c });
    });

    data.serviceSuggestions?.forEach((s) => {
      const key = `service-${s}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ type: "service", label: s, value: s });
    });

    data.menuSuggestions?.forEach((m) => {
      const key = `menu-${m}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ type: "menu", label: m, value: m });
    });

    data.nameSuggestions?.forEach((n) => {
      const key = `name-${n}`;
      if (seen.has(key)) return;
      seen.add(key);
      if (!items.some((i) => i.label === n)) {
        items.push({ type: "caterer", label: n, value: n });
      }
    });

    return items.slice(0, 15);
  }, [data]);

  const locationSuggestions = data?.locationSuggestions || [];
  const categorySuggestions = (data?.categorySuggestions || []).map((c) => c.name);

  const searchIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );

  const locationIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );

  const categoryIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );

  return (
    <div className="relative isolate z-30 rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white to-amber-50/30 shadow-lg shadow-amber-100/30">
      <div className="border-b border-stone-100 bg-white/80 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Find your caterer</h2>
            <p className="text-sm text-stone-500">Search caterers, cuisines, services &amp; locations</p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="interactive shrink-0 rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        <AutocompleteInput
          id="search"
          label="Caterer, cuisine or service"
          value={search}
          onChange={onSearchChange}
          richSuggestions={searchSuggestions}
          placeholder="e.g. Spice Garden, North Indian"
          icon={searchIcon}
          loading={loading}
        />
        <AutocompleteInput
          id="location"
          label="Location"
          value={location}
          onChange={onLocationChange}
          suggestions={locationSuggestions}
          richSuggestions={locationSuggestions.map((l) => ({ type: "location", label: l, value: l }))}
          placeholder="e.g. Mumbai, Goa"
          icon={locationIcon}
          loading={loading}
        />
        <AutocompleteInput
          id="category"
          label="Category"
          value={category}
          onChange={onCategoryChange}
          suggestions={categorySuggestions}
          richSuggestions={categorySuggestions.map((c) => ({ type: "category", label: c, value: c }))}
          placeholder="e.g. Wedding, Corporate"
          icon={categoryIcon}
          loading={loading}
        />
      </div>
    </div>
  );
}
