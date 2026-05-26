import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-foreground mb-3">Contact Us</h1>
        <p className="text-muted-foreground">We'd love to hear from you. Reach out with any questions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-6">Get in Touch</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">hello@entwinestore.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground">India</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-secondary rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Special Offers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>5% OFF on first order — use code <strong className="text-foreground">MYFIRST5</strong></li>
              <li>FREE International Shipping on orders above ₹25,000 — use code <strong className="text-foreground">FREEWORLD</strong></li>
            </ul>
          </div>
        </div>

        {/* Contact form */}
        <div>
          {submitted ? (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">✉</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Message sent!</h3>
              <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                className="mt-4 text-sm text-primary hover:underline"
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
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-sm text-sm hover:bg-primary/90 transition-colors font-medium"
                data-testid="button-contact-submit"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
