import { useGetSaleProducts } from "@workspace/api-client-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalePage() {
  const { data: products, isLoading } = useGetSaleProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded-sm font-medium mb-3">
          SALE
        </div>
        <h1 className="text-2xl font-semibold text-foreground">On Sale</h1>
        {products && (
          <p className="text-sm text-muted-foreground mt-1">{products.length} products on sale</p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <Skeleton className="h-4 mt-2 w-3/4" />
            </div>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No sale products at the moment.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
