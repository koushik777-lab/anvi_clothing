export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <img src="/logo.png" alt="Entwine" className="h-12 mx-auto mb-6" />
        <h1 className="text-3xl font-semibold text-foreground mb-4">About Entwine</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          We are a celebration of India's extraordinary textile heritage — handcrafted clothing that carries centuries of artisan knowledge in every thread.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our Story</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Entwine was born from a deep love of Indian craft traditions — the geometric precision of Ajrakh, the lyrical naturalism of Kalamkari, the rustic beauty of Bagru block prints.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We work directly with artisan communities across Rajasthan, Gujarat, and Andhra Pradesh, ensuring fair wages and preserving techniques passed down through generations.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our Craft</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Every piece in our collection is hand-block printed using natural dyes — madder, indigo, turmeric — on carefully selected natural fabrics like cotton, modal silk, and Chanderi.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No two pieces are ever exactly alike. The subtle variations in color and pattern are a testament to the human hands that create them — a mark of authenticity, not imperfection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-center">
        {[
          { label: "Artisan Families", value: "50+" },
          { label: "Craft Traditions", value: "6" },
          { label: "Natural Dyes", value: "100%" },
          { label: "Happy Customers", value: "10,000+" },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary rounded-lg p-5">
            <p className="text-2xl font-semibold text-primary mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-xl p-8 text-center border border-primary/10">
        <h2 className="text-xl font-semibold text-foreground mb-3">Our Promise</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          When you wear Entwine, you carry a story — of the artisan who pressed the block, mixed the dye, and patiently waited for the cloth to dry in the sun. We believe fashion can be beautiful and responsible at the same time.
        </p>
      </div>
    </div>
  );
}
