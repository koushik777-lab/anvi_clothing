import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useCartSession } from "@/hooks/use-cart-session";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "On sale", href: "/on-sale" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sessionId = useCartSession();
  const { data: cart } = useGetCart(
    { sessionId: sessionId ?? "" },
    { query: { enabled: !!sessionId } }
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
      <div className="bg-primary text-primary-foreground text-xs py-2 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          <span className="px-8">5% OFF on First order with "Myfirst5"</span>
          <span className="px-4">•</span>
          <span className="px-8">FREE International Shipping on orders above ₹25,000. Use Code "FREEWORLD"</span>
          <span className="px-4">•</span>
          <span className="px-8">5% OFF on First order with "Myfirst5"</span>
          <span className="px-4">•</span>
          <span className="px-8">FREE International Shipping on orders above ₹25,000. Use Code "FREEWORLD"</span>
          <span className="px-4">•</span>
          <span className="px-8">5% OFF on First order with "Myfirst5"</span>
          <span className="px-4">•</span>
          <span className="px-8">FREE International Shipping on orders above ₹25,000. Use Code "FREEWORLD"</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    className={`text-sm cursor-pointer transition-colors hover:text-primary ${
                      location === link.href ? "text-primary font-medium underline underline-offset-4" : "text-foreground/70"
                    }`}
                  >
                    {link.label}
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
                <img src="/logo.png" alt="Entwine" className="h-9 w-auto object-contain cursor-pointer" data-testid="link-logo" />
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
                  className="flex-1 border border-border rounded-sm px-4 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="input-search"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-sm hover:bg-primary/90 transition-colors"
                  data-testid="button-search-submit"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm cursor-pointer block ${location === link.href ? "text-primary font-medium" : "text-foreground/70"}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
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
