import { useState } from "react";
import { useGetCategoryProducts, useGetCategories } from "@workspace/api-client-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [page, setPage] = useState(1);
  const { data: categories } = useGetCategories();
  const { data: result, isLoading } = useGetCategoryProducts(params.slug, { page, limit: 12 });

  const category = categories?.find((c) => c.slug === params.slug);
  const totalPages = result?.pages ?? 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {category?.image && (
        <div className="mb-8 relative h-48 rounded-xl overflow-hidden">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40 flex items-end p-6">
            <h1 className="text-3xl font-semibold text-white">{category?.name ?? params.slug}</h1>
          </div>
        </div>
      )}

      {!category?.image && (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground capitalize">{category?.name ?? params.slug.replace(/-/g, " ")}</h1>
          {result && <p className="text-sm text-muted-foreground mt-1">{result.total} products</p>}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <Skeleton className="h-4 mt-2 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {result?.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
