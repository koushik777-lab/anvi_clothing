import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X, Sparkles, Phone, MapPin, Star } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useCartSession } from "@/hooks/use-cart-session";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categories = [
  { label: "Salwar Sets", href: "/shop/salwar-sets" },
  { label: "Co-ord Sets", href: "/shop/co-ord-sets" },
  { label: "Kurtas", href: "/shop/kurtas" },
  { label: "Maternity Wear", href: "/shop/maternity-wear" },
  { label: "Sarees", href: "/shop/sarees" },
  { label: "Kids", href: "/shop/kids" },
  { label: "Night Wear", href: "/shop/night-wear" },
  { label: "Bottoms", href: "/shop/bottoms" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sessionId = useCartSession();
  const { data: cart } = useGetCart(
    { sessionId: sessionId ?? "" },
    { query: { enabled: !!sessionId } as any }
  );

  const itemCount = cart?.itemCount ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
    setSearchOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="text-white text-xs py-2 overflow-hidden" style={{ background: "linear-gradient(90deg, #b8922e, #cea53b, #e0bc5a, #cea53b, #b8922e)" }}>
        <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap items-center">
          <span className="px-8 flex items-center gap-1.5"><Star size={11} className="inline flex-shrink-0" fill="currentColor" /> Welcome to ANVI CLOTHING — Fashion with Love <Star size={11} className="inline flex-shrink-0" fill="currentColor" /></span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><Sparkles size={11} className="inline flex-shrink-0" /> Beautiful, Comfortable &amp; Truly Wearable Fashion</span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><Phone size={11} className="inline flex-shrink-0" /> 9442282319 &nbsp;/&nbsp; 8072454583</span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><MapPin size={11} className="inline flex-shrink-0" /> 143, Raju Naidu Street, Sivananda Colony - 641012</span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><Star size={11} className="inline flex-shrink-0" fill="currentColor" /> Welcome to ANVI CLOTHING — Fashion with Love <Star size={11} className="inline flex-shrink-0" fill="currentColor" /></span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><Sparkles size={11} className="inline flex-shrink-0" /> Beautiful, Comfortable &amp; Truly Wearable Fashion</span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><Phone size={11} className="inline flex-shrink-0" /> 9442282319 &nbsp;/&nbsp; 8072454583</span>
          <span className="px-3 opacity-60">|</span>
          <span className="px-8 flex items-center gap-1.5"><MapPin size={11} className="inline flex-shrink-0" /> 143, Raju Naidu Street, Sivananda Colony - 641012</span>
        </div>
      </div>

      {/* Main Nav — Glassmorphism */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255, 252, 245, 0.72)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(206, 165, 59, 0.18)",
          boxShadow: "0 4px 24px 0 rgba(206, 165, 59, 0.08), 0 1px 0 rgba(206, 165, 59, 0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[72px] md:h-[92px]">
            {/* Left: Desktop nav links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    className={`text-sm font-medium cursor-pointer transition-all duration-200 hover:text-primary relative group ${
                      location === link.href ? "text-primary" : "text-foreground/70"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full transition-all duration-300 ${
                        location === link.href ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile: hamburger */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                <img
                  src="/anvi_logo.png"
                  alt="Anvi Clothing"
                  className="h-[140px] md:h-[180px] w-auto object-contain cursor-pointer transition-all duration-300 ease-in-out hover:scale-108 hover:brightness-105 active:scale-95 filter drop-shadow-sm hover:drop-shadow-[0_4px_12px_rgba(206,165,59,0.18)]"
                  data-testid="link-logo"
                />
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-foreground/70 hover:text-primary transition-colors"
                data-testid="button-search"
              >
                <Search size={18} />
              </button>
              <Link href="/cart">
                <span
                  className="relative p-1.5 text-foreground/70 hover:text-primary transition-colors cursor-pointer flex items-center"
                  data-testid="link-cart"
                >
                  <ShoppingBag size={18} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </span>
              </Link>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border border-border rounded-sm px-4 py-2 text-sm bg-background/80 focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="input-search"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-sm hover:bg-primary/90 transition-colors font-medium"
                  data-testid="button-search-submit"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Category Sub-nav */}
        <div
          className="hidden md:block border-t"
          style={{
            borderTop: "1px solid rgba(206, 165, 59, 0.15)",
            background: "rgba(255, 252, 245, 0.5)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-8 h-10">
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href}>
                  <span
                    className={`text-xs font-medium cursor-pointer tracking-wide transition-all duration-200 hover:text-primary relative group ${
                      location === cat.href ? "text-primary" : "text-foreground/60"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-primary rounded-full transition-all duration-300 ${
                        location === cat.href ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 py-4 flex flex-col gap-3"
            style={{
              background: "rgba(255, 252, 245, 0.95)",
              borderTop: "1px solid rgba(206, 165, 59, 0.15)",
            }}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium cursor-pointer block py-1 ${location === link.href ? "text-primary" : "text-foreground/70"}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="border-t border-border/40 pt-3 mt-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-medium">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link key={cat.href} href={cat.href}>
                    <span
                      onClick={() => setMobileOpen(false)}
                      className="text-xs bg-secondary text-foreground/70 rounded-full px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {cat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
