import { Heart, Sparkles, ShoppingBag, Phone, Mail, MapPin, Star, Flower2 } from "lucide-react";

const G = "#cea53b"; // golden

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <img
          src="/anvi_logo.png"
          alt="Anvi Clothing"
          className="h-28 mx-auto mb-8 object-contain transition-all duration-300 ease-in-out hover:scale-105 filter hover:drop-shadow-[0_4px_12px_rgba(206,165,59,0.15)]"
        />
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flower2 size={14} style={{ color: G }} />
          <p className="text-xs tracking-[0.35em] uppercase font-semibold" style={{ color: G }}>Our Story</p>
          <Flower2 size={14} style={{ color: G }} />
        </div>
        <h1
          className="text-4xl font-bold text-foreground mb-5"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          ANVI – With Love
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          Bringing together collections that feel beautiful, comfortable, and truly wearable — for everyday women and little girls.
        </p>
      </div>

      {/* Story card */}
      <div
        className="rounded-2xl p-8 sm:p-10 mb-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fdf8ef 0%, #fef9ec 100%)",
          border: "1px solid rgba(206,165,59,0.2)",
          boxShadow: "0 4px 30px rgba(206,165,59,0.08)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: G, transform: "translate(30%, -30%)" }}
        />
        <div className="relative space-y-4">
          <p className="text-base text-foreground/80 leading-relaxed flex items-start gap-2">
            <Heart size={16} style={{ color: G }} fill={G} className="flex-shrink-0 mt-0.5" />
            ANVI was created with a simple thought — to bring together collections that feel beautiful, comfortable, and truly wearable for everyday women and little girls.
          </p>
          <p className="text-base text-foreground/80 leading-relaxed">
            What started as a small dream and a carefully curated online journey is now growing into something even more special. Every piece at ANVI is personally handpicked with love, keeping <strong className="text-foreground">quality, elegance, comfort, and affordability</strong> in mind.
          </p>
          <p className="text-base text-foreground/80 leading-relaxed flex items-start gap-2">
            <Sparkles size={16} style={{ color: G }} className="flex-shrink-0 mt-0.5" />
            We believe fashion is not just about trends — it's about finding outfits that make you feel <strong className="text-foreground">confident, graceful, and happy</strong> every time you wear them.
          </p>
          <p className="text-base text-foreground/80 leading-relaxed">
            From timeless sarees to charming kidswear, ANVI is built to be a space where every collection feels like a favourite waiting to enter your wardrobe.
          </p>
          <p className="text-base text-foreground/80 leading-relaxed flex items-start gap-2">
            <ShoppingBag size={16} style={{ color: G }} className="flex-shrink-0 mt-0.5" />
            And now… we're excited to bring the real ANVI experience closer to you with our <strong className="text-foreground">offline store</strong>.
          </p>
          <p className="text-base text-foreground/80 leading-relaxed flex items-start gap-2">
            <Heart size={16} style={{ color: G }} fill={G} className="flex-shrink-0 mt-0.5" />
            Thank you for growing with us, supporting our small dream, and being a part of this journey.
          </p>
          <p className="text-base font-semibold" style={{ color: G }}>
            With love,<br />
            Nivetha | ANVI
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12 text-center">
        {[
          { label: "Happy Customers", value: "1000+", icon: <Heart size={18} fill={G} style={{ color: G }} /> },
          { label: "Collections", value: "8+", icon: <Star size={18} fill={G} style={{ color: G }} /> },
          { label: "Quality Promise", value: "100%", icon: <Sparkles size={18} style={{ color: G }} /> },
          { label: "Since", value: "2026", icon: <Flower2 size={18} style={{ color: G }} /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #fdf8ef, #fff)",
              border: "1px solid rgba(206,165,59,0.18)",
              boxShadow: "0 2px 12px rgba(206,165,59,0.06)",
            }}
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p
              className="text-2xl font-bold mb-1"
              style={{ color: G, fontFamily: "'Cormorant Garamond', serif" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Offline store promo */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg, #1a1209 0%, #2d1f07 100%)",
          boxShadow: "0 8px 30px rgba(206,165,59,0.15)",
        }}
      >
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(206,165,59,0.15)" }}>
            <ShoppingBag size={24} style={{ color: G }} />
          </div>
        </div>
        <h2
          className="text-2xl font-bold text-white mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Visit Our Store
        </h2>
        <p className="text-white/70 text-sm leading-relaxed max-w-lg mx-auto mb-3">
          143, Raju Naidu Street, Sivananda Colony - 641012
        </p>
        <p className="text-sm flex items-center justify-center gap-1.5 mb-1" style={{ color: G }}>
          <Phone size={13} /> 9442282319 / 8072454583
        </p>
        <p className="text-sm flex items-center justify-center gap-1.5" style={{ color: G }}>
          <Mail size={13} /> anviclothing2026@gmail.com
        </p>
      </div>
    </div>
  );
}
