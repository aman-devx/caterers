import type { Caterer } from "./caterer";
import type { MenuItem } from "./menu";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  pricingNote: string;
  details: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryDetail extends Category {
  caterers: Caterer[];
  menuByCaterer: Record<string, MenuItem[]>;
  pricing: {
    min: number | null;
    max: number | null;
    note: string;
  };
}

export interface CatererSearchResult {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerPlate: number;
  cuisines?: string[];
  coverImage?: string;
  logo?: string;
}

export interface SearchSuggestions {
  nameSuggestions: string[];
  locationSuggestions: string[];
  categorySuggestions: { id: string; name: string; slug: string }[];
  cuisineSuggestions: string[];
  serviceSuggestions?: string[];
  menuSuggestions?: string[];
  catererResults?: CatererSearchResult[];
  results: import("./caterer").Caterer[];
}
