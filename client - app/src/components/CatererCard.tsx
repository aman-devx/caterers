import Link from "next/link";
import type { Caterer } from "@/types/caterer";
import SafeImage from "./SafeImage";
import StarRating from "./StarRating";

const CARD_GRADIENTS = [
  "from-amber-50 to-orange-50",
  "from-rose-50 to-orange-50",
  "from-emerald-50 to-teal-50",
  "from-sky-50 to-indigo-50",
  "from-violet-50 to-purple-50",
];

interface CatererCardProps {
  caterer: Caterer;
  index: number;
}

export default function CatererCard({ caterer, index }: CatererCardProps) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <Link href={`/caterers/${caterer.id}`} className="interactive block cursor-pointer">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/50">
        {(caterer.coverImage || caterer.images?.[0]) && (
          <div className="relative h-36 w-full">
            <SafeImage
              src={caterer.coverImage || caterer.images![0]}
              alt={caterer.name}
              fill
              sizes="(max-width:768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className={`${caterer.coverImage ? "px-5 py-4" : `bg-gradient-to-br ${gradient} px-5 py-4`}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-900">
                {caterer.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600">
                <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {caterer.location}
              </p>
            </div>
            <StarRating rating={caterer.rating} size="sm" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Price per plate
            </span>
            <span className="text-2xl font-bold text-stone-900">
              ₹{caterer.pricePerPlate.toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
              Cuisines
            </p>
            <div className="flex flex-wrap gap-1.5">
              {caterer.cuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-auto text-sm font-medium text-amber-700 group-hover:text-amber-900">
            View menu & services →
          </p>
        </div>
      </article>
    </Link>
  );
}
