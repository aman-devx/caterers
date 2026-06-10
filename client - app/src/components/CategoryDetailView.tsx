"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CategoryDetail } from "@/types/category";
import ImageGallery from "./ImageGallery";
import MenuCategorySection from "./MenuCategorySection";
import StarRating from "./StarRating";

interface CategoryDetailViewProps {
  data: CategoryDetail;
}

export default function CategoryDetailView({ data }: CategoryDetailViewProps) {
  const [expandedCaterer, setExpandedCaterer] = useState<string | null>(
    data.caterers[0]?.id || null
  );

  const allImages = [data.image, ...data.images].filter(Boolean);

  return (
    <div>
      <section className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/caterers"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-amber-700 transition-colors hover:text-amber-900"
          >
            ← Back to caterers
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Category</p>
              <h1 className="mt-1 text-3xl font-bold text-stone-900 sm:text-4xl">{data.name}</h1>
              <p className="mt-4 leading-relaxed text-stone-600">{data.description}</p>
              {data.details && (
                <p className="mt-3 text-sm leading-relaxed text-stone-500">{data.details}</p>
              )}

              <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Pricing
                </p>
                {data.pricing.min != null && data.pricing.max != null ? (
                  <p className="mt-2 text-2xl font-bold text-stone-900">
                    ₹{data.pricing.min.toLocaleString("en-IN")} – ₹
                    {data.pricing.max.toLocaleString("en-IN")}
                  </p>
                ) : (
                  <p className="mt-2 text-lg font-medium text-stone-700">Contact for quote</p>
                )}
                {data.pricing.note && (
                  <p className="mt-2 text-sm text-stone-600">{data.pricing.note}</p>
                )}
              </div>
            </div>

            {data.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {allImages.length > 1 && (
          <ImageGallery images={allImages} title="Category Gallery" />
        )}

        <div>
          <h2 className="mb-4 text-2xl font-bold text-stone-900">
            Caterers in this category ({data.caterers.length})
          </h2>

          {data.caterers.length === 0 ? (
            <p className="text-stone-500">No caterers linked to this category yet.</p>
          ) : (
            <div className="space-y-4">
              {data.caterers.map((caterer) => {
                const menu = data.menuByCaterer[caterer.id] || [];
                const isOpen = expandedCaterer === caterer.id;
                const grouped = menu.reduce<Record<string, typeof menu>>((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {});

                return (
                  <div
                    key={caterer.id}
                    className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedCaterer(isOpen ? null : caterer.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-stone-50"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900">{caterer.name}</h3>
                        <p className="text-sm text-stone-500">{caterer.location}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <StarRating rating={caterer.rating} size="sm" />
                          <span className="text-sm font-medium text-amber-700">
                            ₹{caterer.pricePerPlate}/plate
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="border-t border-stone-100 p-5">
                        {caterer.description && (
                          <p className="mb-4 text-sm text-stone-600">{caterer.description}</p>
                        )}
                        <Link
                          href={`/caterers/${caterer.id}`}
                          className="interactive mb-6 inline-flex text-sm font-medium text-amber-700 hover:text-amber-900"
                        >
                          View full caterer profile →
                        </Link>

                        {menu.length === 0 ? (
                          <p className="text-sm text-stone-500">No menu items listed yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(grouped).map(([cat, items]) => (
                              <MenuCategorySection key={cat} category={cat} items={items} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
