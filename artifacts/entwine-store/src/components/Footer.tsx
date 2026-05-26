import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <img src="/logo.png" alt="Entwine" className="h-8 w-auto mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Celebrating India's textile heritage through handcrafted block-print clothing for the modern woman.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop"><span className="hover:text-primary transition-colors cursor-pointer">All Products</span></Link></li>
            <li><Link href="/shop/co-ord-sets"><span className="hover:text-primary transition-colors cursor-pointer">Co-ord Sets</span></Link></li>
            <li><Link href="/shop/kurta-pant-sets"><span className="hover:text-primary transition-colors cursor-pointer">Kurta Pant Sets</span></Link></li>
            <li><Link href="/shop/dresses"><span className="hover:text-primary transition-colors cursor-pointer">Dresses</span></Link></li>
            <li><Link href="/on-sale"><span className="hover:text-primary transition-colors cursor-pointer">On Sale</span></Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about"><span className="hover:text-primary transition-colors cursor-pointer">About Us</span></Link></li>
            <li><Link href="/contact"><span className="hover:text-primary transition-colors cursor-pointer">Contact Us</span></Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span>Free shipping on orders above ₹25,000</span></li>
            <li><span>5% off on first order</span></li>
            <li><span>Use code: MYFIRST5</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Entwine. All rights reserved.
      </div>
    </footer>
  );
}
