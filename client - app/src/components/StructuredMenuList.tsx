"use client";

import type { MenuItem } from "@/types/menu";
import { MENU_CATEGORY_ORDER } from "@/lib/images";
import SafeImage from "./SafeImage";

interface StructuredMenuListProps {
  items: MenuItem[];
  collapsible?: boolean;
}

function VegBadge({ isVeg }: { isVeg?: boolean }) {
  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] font-bold ${
        isVeg !== false
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-red-600 bg-red-50 text-red-700"
      }`}
      title={isVeg !== false ? "Vegetarian" : "Non-Vegetarian"}
    >
      {isVeg !== false ? "●" : "▲"}
    </span>
  );
}

export default function StructuredMenuList({ items }: StructuredMenuListProps) {
  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const orderedCategories = [
    ...MENU_CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !MENU_CATEGORY_ORDER.includes(c)),
  ];

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
        Menu coming soon.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {orderedCategories.map((category) => (
        <div key={category}>
          <h3 className="mb-4 flex items-center gap-2 border-b border-amber-200 pb-2 text-lg font-semibold text-amber-900">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {category}
            <span className="ml-auto text-sm font-normal text-stone-400">{grouped[category].length} items</span>
          </h3>
          <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            {grouped[category].map((item) => (
              <div key={item.id} className="flex gap-4 p-4 transition-colors hover:bg-amber-50/30 sm:p-5">
                {item.images && item.images[0] && (
                  <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:block">
                    <SafeImage src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <VegBadge isVeg={item.isVeg} />
                    <h4 className="font-semibold text-stone-900">{item.name}</h4>
                    <span className="ml-auto shrink-0 text-lg font-bold text-amber-700">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-stone-500">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
