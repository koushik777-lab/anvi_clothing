import { Link } from "wouter";
import { Instagram, Mail, Phone, MapPin, Heart, Flower2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t" style={{ background: "#fdf8ef", borderTop: "1px solid rgba(206,165,59,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <img
            src="/anvi_logo.png"
            alt="Anvi Clothing"
            className="h-28 w-auto mb-5 object-contain transition-all duration-300 ease-in-out hover:scale-105 filter hover:drop-shadow-[0_4px_12px_rgba(206,165,59,0.12)]"
          />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Beautiful, comfortable, and truly wearable fashion — handpicked with love for everyday women and little girls.
            <Flower2 size={13} className="inline ml-1" style={{ color: "#cea53b" }} />
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="https://www.instagram.com/anvi_by_nivetha"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(206,165,59,0.12)", border: "1px solid rgba(206,165,59,0.3)", color: "#cea53b" }}
            >
              <Instagram size={15} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest" style={{ color: "#cea53b" }}>Collections</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/shop/salwar-sets"><span className="hover:text-primary transition-colors cursor-pointer">Salwar Sets</span></Link></li>
            <li><Link href="/shop/co-ord-sets"><span className="hover:text-primary transition-colors cursor-pointer">Co-ord Sets</span></Link></li>
            <li><Link href="/shop/kurtas"><span className="hover:text-primary transition-colors cursor-pointer">Kurtas</span></Link></li>
            <li><Link href="/shop/maternity-wear"><span className="hover:text-primary transition-colors cursor-pointer">Maternity Wear</span></Link></li>
            <li><Link href="/shop/sarees"><span className="hover:text-primary transition-colors cursor-pointer">Sarees</span></Link></li>
            <li><Link href="/shop/kids"><span className="hover:text-primary transition-colors cursor-pointer">Kids</span></Link></li>
            <li><Link href="/shop/night-wear"><span className="hover:text-primary transition-colors cursor-pointer">Night Wear</span></Link></li>
            <li><Link href="/shop/bottoms"><span className="hover:text-primary transition-colors cursor-pointer">Bottoms</span></Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest" style={{ color: "#cea53b" }}>Company</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/about"><span className="hover:text-primary transition-colors cursor-pointer">About Us</span></Link></li>
            <li><Link href="/contact"><span className="hover:text-primary transition-colors cursor-pointer">Contact Us</span></Link></li>
            <li><Link href="/shop"><span className="hover:text-primary transition-colors cursor-pointer">Shop All</span></Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest" style={{ color: "#cea53b" }}>Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#cea53b" }} />
              <span className="leading-relaxed">143, Raju Naidu Street,<br />Sivananda Colony - 641012</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={14} className="flex-shrink-0" style={{ color: "#cea53b" }} />
              <span>9442282319 / 8072454583</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} className="flex-shrink-0" style={{ color: "#cea53b" }} />
              <a href="mailto:anviclothing2026@gmail.com" className="hover:text-primary transition-colors">
                anviclothing2026@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-5 text-center text-xs text-muted-foreground"
        style={{ borderTop: "1px solid rgba(206,165,59,0.12)" }}
      >
        <p className="flex items-center justify-center gap-1.5">© {new Date().getFullYear()} <span className="font-semibold" style={{ color: "#cea53b" }}>Anvi Clothing</span>. All rights reserved. Made with <Heart size={12} fill="#cea53b" style={{ color: "#cea53b" }} /> by Koushik.</p>
      </div>
    </footer>
  );
}
