import { fetchCaterers, fetchCategories } from "@/lib/api";
import CatererGrid from "@/components/CatererGrid";
import Header from "@/components/Header";
import Link from "next/link";
import type { Caterer } from "@/types/caterer";

export const metadata = {
  title: "Browse Caterers | CaterersNearMe",
  description: "Search and filter catering services by name, location, and price per plate.",
};

export default async function CaterersPage() {
  let caterers: Caterer[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  let error: string | null = null;

  try {
    [caterers, categories] = await Promise.all([fetchCaterers(), fetchCategories()]);
  } catch {
    error = "Unable to connect to the API. Please check your network or try again later.";
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-stone-200/80 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/60 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Curated catering partners
            </p>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Find the perfect caterer for your event
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Search by name, location, or category. Filter by price and explore full menus.
            </p>

            {categories.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="interactive rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl overflow-visible px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          ) : (
            <CatererGrid caterers={caterers} categories={categories} />
          )}
        </section>
      </main>

      <footer className="border-t border-stone-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-stone-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} CaterersNearMe. Built for your next celebration.
        </div>
      </footer>
    </div>
  );
}
