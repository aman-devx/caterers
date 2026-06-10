"use client";

import SafeImage from "./SafeImage";
import { useState } from "react";
import type { MenuItem } from "@/types/menu";

interface MenuCategorySectionProps {
  category: string;
  items: MenuItem[];
}

export default function MenuCategorySection({ category, items }: MenuCategorySectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-stone-50"
      >
        <h3 className="text-lg font-semibold text-amber-900">{category}</h3>
        <span className="flex items-center gap-2 text-sm text-stone-500">
          {items.length} items
          <svg
            className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="border-t border-stone-100 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-stone-100 bg-stone-50/50 transition-shadow hover:shadow-md"
              >
                {item.images && item.images.length > 0 && (
                  <div className="relative aspect-video w-full">
                    <SafeImage src={item.images[0]} alt={item.name} fill sizes="(max-width:768px) 100vw,400px" className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-stone-900">{item.name}</h4>
                    <span className="shrink-0 font-bold text-amber-700">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-stone-500">{item.description}</p>
                  )}
                  {item.details && (
                    <p className="mt-2 text-xs text-stone-400">{item.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
