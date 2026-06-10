import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CatererProfileView from "@/components/CatererProfileView";
import { fetchCatererById } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CatererDetailPage({ params }: PageProps) {
  const { id } = await params;

  let caterer;
  try {
    caterer = await fetchCatererById(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main>
        <CatererProfileView caterer={caterer} />
      </main>
    </div>
  );
}
