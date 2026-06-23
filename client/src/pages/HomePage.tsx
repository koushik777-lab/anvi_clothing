import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Sparkles, Heart, ShoppingBag as BagIcon, Star, Flower2, Instagram } from "lucide-react";
import { useGetFeaturedProducts, useGetCategories, useGetProducts, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartSession } from "@/hooks/use-cart-session";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Hero Sliding Banner (3 slides) ─────────────────────────────────────────

const heroSlides = [
  {
    src: "https://priyankaraajiv.com/cdn/shop/articles/Cultural_Significance_of_all_Saree_Colours_043a7c1d-fe5a-4b87-ad68-5fe359270413.jpg?v=1763645705&width=1600",
    heading: "Feel Beautiful Every Day",
    subheading: "Handpicked collections crafted with love — for everyday women and little girls.",
    icon: "flower",
    cta: "Explore Collection",
    href: "/shop",
  },
  {
    src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&auto=format&fit=crop&q=85",
    heading: "Comfort Meets Elegance",
    subheading: "From timeless Sarees to charming Kidswear — ANVI is your favourite waiting to enter your wardrobe.",
    icon: "sparkles",
    cta: "Shop Now",
    href: "/shop",
  },
  {
    src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&auto=format&fit=crop&q=85",
    heading: "Our Offline Store is Here!",
    subheading: "Visit us at 143, Raju Naidu Street, Sivananda Colony — experience ANVI in person.",
    icon: "bag",
    cta: "Contact Us",
    href: "/contact",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating]
  );

  const prev = () => goTo((current - 1 + heroSlides.length) % heroSlides.length);
  const next = useCallback(() => goTo((current + 1) % heroSlides.length), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(420px, 65vh, 680px)" }}>
      {/* Slides */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.src}
            alt={s.heading}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 w-full">
          <div className="max-w-xl">
            {/* Brand badge */}
            <span
              className="inline-block text-xs tracking-[0.3em] uppercase font-semibold mb-4 px-4 py-1.5 rounded-full"
              style={{
                background: "rgba(206,165,59,0.22)",
                border: "1px solid rgba(206,165,59,0.5)",
                color: "#f5d98b",
                backdropFilter: "blur(8px)",
              }}
            >
              ANVI CLOTHING
            </span>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              {slide.heading}
            </h1>
            <p className="text-white/85 text-base sm:text-lg mb-8 leading-relaxed max-w-md flex items-start gap-2">
              {slide.icon === "flower" && <Flower2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#f5d98b" }} />}
              {slide.icon === "sparkles" && <Sparkles size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#f5d98b" }} />}
              {slide.icon === "bag" && <BagIcon size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#f5d98b" }} />}
              <span>{slide.subheading}</span>
            </p>
            <Link href={slide.href}>
              <span
                className="inline-block px-8 py-3.5 rounded-sm text-sm font-semibold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #cea53b, #e0bc5a)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(206,165,59,0.4)",
                  letterSpacing: "0.05em",
                }}
              >
                {slide.cta}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              background: i === current ? "#cea53b" : "rgba(255,255,255,0.5)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Category Stories ────────────────────────────────────────────────────────

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
                <div
                  className="w-20 h-20 rounded-full overflow-hidden shadow-sm transition-all duration-300 group-hover:scale-105"
                  style={{
                    border: "2px solid transparent",
                    backgroundClip: "padding-box",
                    boxShadow: "0 0 0 2px rgba(206,165,59,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 2px #cea53b";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 2px rgba(206,165,59,0.15)";
                  }}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-primary font-semibold text-lg uppercase">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs text-center text-foreground/70 font-medium max-w-[80px] leading-tight group-hover:text-primary transition-colors">
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

// ─── Favourites Carousel ─────────────────────────────────────────────────────

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
    <section className="py-14" style={{ background: "linear-gradient(180deg, #fdf8ef 0%, #fff 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Your Favourites</h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Heart size={11} style={{ color: "#cea53b" }} fill="#cea53b" />Handpicked with love, just for you
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
              style={{ borderColor: "rgba(206,165,59,0.3)" }}
              data-testid="button-prev-carousel"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
              style={{ borderColor: "rgba(206,165,59,0.3)" }}
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

// ─── Featured Collections ────────────────────────────────────────────────────

function FeaturedCollections() {
  const { data: result, isLoading } = useGetProducts({ featured: true, limit: 8 });

  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">New Arrivals</h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Sparkles size={11} style={{ color: "#cea53b" }} />Fresh picks — quality, elegance &amp; comfort
            </p>
          </div>
          <Link href="/shop">
            <span className="text-sm text-primary hover:underline cursor-pointer font-medium" data-testid="link-view-all">View All</span>
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

// ─── Promo / Brand Story Strip ───────────────────────────────────────────────

function PromoSection() {
  return (
    <section
      className="py-14 text-center px-4"
      style={{ background: "linear-gradient(135deg, #1a1209 0%, #2d1f07 50%, #1a1209 100%)" }}
    >
      <div className="max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.35em] uppercase font-semibold mb-3" style={{ color: "#cea53b" }}>
          ANVI CLOTHING
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Fashion with Heart
        </h2>
        <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-lg mx-auto flex items-center justify-center gap-2">
          <Heart size={14} style={{ color: "#cea53b" }} fill="#cea53b" />
          Every piece at ANVI is personally handpicked with love — keeping quality, elegance, comfort, and affordability in mind.
          <Heart size={14} style={{ color: "#cea53b" }} fill="#cea53b" />
        </p>
        <Link href="/shop">
          <span
            className="inline-block px-8 py-3 text-sm font-semibold rounded-sm cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              border: "1px solid #cea53b",
              color: "#cea53b",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#cea53b";
              el.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "#cea53b";
            }}
            data-testid="link-shop-now"
          >
            Shop Now
          </span>
        </Link>
      </div>
    </section>
  );
}

// ─── Instagram Strip ─────────────────────────────────────────────────────────

function InstagramStrip() {
  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase font-semibold text-muted-foreground mb-1">Follow Us</p>
        <h2 className="text-xl font-semibold text-foreground mb-1">@anvi_by_nivetha</h2>
        <p className="text-sm text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
          Tag us in your looks — we'd love to feature you!
          <Sparkles size={14} style={{ color: "#cea53b" }} />
        </p>
        <div className="flex gap-2 justify-center text-sm text-muted-foreground items-center">
          <Instagram size={14} style={{ color: "#cea53b" }} />
          <a href="https://www.instagram.com/anvi_by_nivetha" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            @anvi_by_nivetha
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <CategoryStories />
      <FavouritesCarousel />
      <FeaturedCollections />
      <PromoSection />
      <InstagramStrip />
    </div>
  );
}
