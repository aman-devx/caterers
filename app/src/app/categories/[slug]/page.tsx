import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CategoryDetailView from "@/components/CategoryDetailView";
import { fetchCategoryBySlug } from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = await fetchCategoryBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main>
        <CategoryDetailView data={data} />
      </main>
    </div>
  );
}
