import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetFeaturedProducts, useGetCategories, useGetProducts, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartSession } from "@/hooks/use-cart-session";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    alt: "Block Print Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    alt: "Ajrakh Set",
  },
  {
    src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80",
    alt: "Kalamkari Dress",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80",
    alt: "Handloom Kurta",
  },
];

const bannerImages = [
  "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583396618422-70d0b73eac01?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="bg-[#f9f5ef] py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {bannerImages.map((src, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-sm">
              <img
                src={src}
                alt={`Entwine collection ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Handcrafted Block-Print Fashion
          </h1>
          <p className="text-muted-foreground text-sm mb-6 max-w-xl mx-auto">
            Celebrating India's textile heritage — Ajrakh, Kalamkari, Bagru, Dabu — for the modern woman.
          </p>
          <Link href="/shop">
            <span className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-sm text-sm hover:bg-primary/90 transition-colors cursor-pointer font-medium">
              Explore Collection
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryStories() {
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="w-16 h-3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap gap-6 justify-center">
          {categories?.map((cat) => (
            <Link key={cat._id} href={`/shop/${cat.slug}`}>
              <div className="flex flex-col items-center gap-2 group cursor-pointer" data-testid={`link-category-${cat.slug}`}>
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors shadow-sm">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-primary font-semibold text-lg uppercase">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs text-center text-foreground/70 font-medium max-w-[80px] leading-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FavouritesCarousel() {
  const [offset, setOffset] = useState(0);
  const { data: products, isLoading } = useGetFeaturedProducts();
  const addToCart = useAddToCart();
  const sessionId = useCartSession();
  const queryClient = useQueryClient();

  const visibleCount = 4;
  const maxOffset = products ? Math.max(0, products.length - visibleCount) : 0;

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  const handleQuickAdd = (product: { _id: string; name: string }) => {
    if (!sessionId) return;
    addToCart.mutate(
      {
        data: {
          sessionId,
          productId: product._id,
          quantity: 1,
          size: "M",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        },
      }
    );
  };

  return (
    <section className="py-14 bg-[#f9f5ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Your Favourites in Motion</h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
              data-testid="button-prev-carousel"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
              data-testid="button-next-carousel"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500"
            style={{ transform: `translateX(-${offset * (100 / visibleCount)}%)` }}
          >
            {isLoading
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[calc(25%-12px)] flex-shrink-0">
                    <Skeleton className="aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 mt-2 w-3/4" />
                    <Skeleton className="h-3 mt-1 w-1/2" />
                  </div>
                ))
              : products?.map((product) => (
                  <div key={product._id} className="min-w-[calc(25%-12px)] flex-shrink-0">
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleQuickAdd(product)}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollections() {
  const { data: result, isLoading } = useGetProducts({ featured: true, limit: 8 });

  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Featured Collection</h2>
          <Link href="/shop">
            <span className="text-sm text-primary hover:underline cursor-pointer" data-testid="link-view-all">View All</span>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
      </div>
    </section>
  );
}

function PromoSection() {
  return (
    <section className="py-12 bg-primary text-primary-foreground text-center">
      <h2 className="text-2xl font-semibold mb-2">First Order Special</h2>
      <p className="text-primary-foreground/80 text-sm mb-4">
        Get 5% off your first order. Use code <strong className="font-bold">MYFIRST5</strong> at checkout.
      </p>
      <Link href="/shop">
        <span
          className="inline-block border border-primary-foreground text-primary-foreground px-6 py-2.5 text-sm rounded-sm hover:bg-primary-foreground hover:text-primary transition-colors cursor-pointer"
          data-testid="link-shop-now"
        >
          Shop Now
        </span>
      </Link>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryStories />
      <FavouritesCarousel />
      <FeaturedCollections />
      <PromoSection />
    </div>
  );
}
