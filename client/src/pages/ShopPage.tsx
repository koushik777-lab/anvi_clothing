import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";

export default function ShopPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useGetCategories();
  const { data: result, isLoading } = useGetProducts({
    page,
    limit: 12,
    ...(categoryFilter && { category: categoryFilter }),
    ...(searchQuery && { search: searchQuery }),
  });

  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  const totalPages = result?.pages ?? 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {searchQuery ? `Search: "${searchQuery}"` : categoryFilter ? categories?.find((c) => c.slug === categoryFilter)?.name ?? "Shop" : "Shop All"}
          </h1>
          {result && (
            <p className="text-sm text-muted-foreground mt-1">{result.total} products</p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm border border-border rounded-sm px-3 py-2 hover:bg-secondary transition-colors"
          data-testid="button-toggle-filters"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="mb-8 p-4 bg-secondary rounded-lg border border-border">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("")}
              className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${!categoryFilter ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-background"}`}
              data-testid="filter-all"
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategoryFilter(cat.slug === categoryFilter ? "" : cat.slug)}
                className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${categoryFilter === cat.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-background"}`}
                data-testid={`filter-${cat.slug}`}
              >
                {cat.name} ({cat.productCount})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category quick tabs */}
      <div className="flex gap-3 flex-wrap mb-8">
        <button
          onClick={() => setCategoryFilter("")}
          className={`text-sm pb-1 border-b-2 transition-colors ${!categoryFilter ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setCategoryFilter(cat.slug === categoryFilter ? "" : cat.slug)}
            className={`text-sm pb-1 border-b-2 transition-colors ${categoryFilter === cat.slug ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            data-testid={`tab-${cat.slug}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <Skeleton className="h-4 mt-2 w-3/4" />
              <Skeleton className="h-3 mt-1 w-1/2" />
            </div>
          ))}
        </div>
      ) : result?.products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No products found.</p>
          <button onClick={() => setCategoryFilter("")} className="mt-4 text-primary text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {result?.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
            data-testid="button-prev-page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
            data-testid="button-next-page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
