import { useState } from "react";
import { Mail, MapPin, Phone, Instagram, MessageCircle, Store, Heart, Sparkles, Send } from "lucide-react";

const G = "#cea53b";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/store/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send message");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart size={14} fill={G} style={{ color: G }} />
          <p className="text-xs tracking-[0.35em] uppercase font-semibold" style={{ color: G }}>
            We'd love to hear from you
          </p>
          <Heart size={14} fill={G} style={{ color: G }} />
        </div>
        <h1
          className="text-4xl font-bold text-foreground mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Contact Us
        </h1>
        <p className="text-muted-foreground flex items-center justify-center gap-1.5">
          Reach out with any questions — we're here for you
          <Heart size={13} fill={G} style={{ color: G }} />
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-6">Get in Touch</h2>

          {/* Brand card */}
          <div
            className="rounded-xl p-6 mb-6"
            style={{
              background: "linear-gradient(135deg, #fdf8ef, #fff)",
              border: "1px solid rgba(206,165,59,0.2)",
              boxShadow: "0 4px 20px rgba(206,165,59,0.07)",
            }}
          >
            <p className="font-semibold text-foreground mb-4 text-lg flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <Sparkles size={18} style={{ color: G }} /> Anvi Clothing
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(206,165,59,0.1)" }}>
                  <MapPin size={15} style={{ color: G }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    143, Raju Naidu Street,<br />
                    Sivananda Colony - 641012
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(206,165,59,0.1)" }}>
                  <Phone size={15} style={{ color: G }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    <a href="tel:9442282319" className="hover:text-primary transition-colors">9442282319</a>
                    {" / "}
                    <a href="tel:8072454583" className="hover:text-primary transition-colors">8072454583</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(206,165,59,0.1)" }}>
                  <Mail size={15} style={{ color: G }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href="mailto:anviclothing2026@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    anviclothing2026@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(206,165,59,0.1)" }}>
                  <Instagram size={15} style={{ color: G }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Instagram</p>
                  <a
                    href="https://www.instagram.com/anvi_by_nivetha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                  >
                    @anvi_by_nivetha
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Store visit card */}
          <div
            className="rounded-xl p-5 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, #1a1209, #2d1f07)" }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(206,165,59,0.15)" }}>
              <Store size={16} style={{ color: G }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Visit Our Store</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Come experience ANVI in person. We'd love to help you find your perfect outfit!
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          {submitted ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "linear-gradient(135deg, #fdf8ef, #fff)",
                border: "1px solid rgba(206,165,59,0.2)",
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(206,165,59,0.12)" }}>
                <MessageCircle size={28} style={{ color: G }} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Message Sent!
              </h3>
              <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                Thank you for reaching out. We'll get back to you soon
                <Heart size={13} fill={G} style={{ color: G }} />
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                className="mt-4 text-sm font-medium hover:underline"
                style={{ color: G }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="input-contact-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  data-testid="input-contact-message"
                />
              </div>
              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #cea53b, #e0bc5a)",
                  color: "#fff",
                  boxShadow: "0 4px 15px rgba(206,165,59,0.3)",
                }}
                data-testid="button-contact-submit"
              >
                <Send size={15} /> {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
