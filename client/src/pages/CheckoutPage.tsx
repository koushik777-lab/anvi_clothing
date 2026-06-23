import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartSession } from "@/hooks/use-cart-session";
import { formatPrice } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, MapPin, Phone, Mail, CheckCircle, ChevronRight, CreditCard, Banknote, AlertTriangle, PartyPopper, Sparkles } from "lucide-react";

const GOLD = "#cea53b";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi",
];

function StepIndicator({ step }: { step: number }) {
  const steps = ["Cart Review", "Delivery Info", "Order Placed"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              style={i + 1 <= step
                ? { background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)`, color: "#fff" }
                : { background: "#f3f4f6", color: "#9ca3af" }}
            >
              {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className="text-xs mt-1.5 font-medium" style={{ color: i + 1 <= step ? GOLD : "#9ca3af" }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-16 sm:w-24 h-0.5 mb-4 mx-1" style={{ background: i + 1 < step ? GOLD : "#e5e7eb" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const sessionId = useCartSession();
  const { data: cart, isLoading } = useGetCart(
    { sessionId: sessionId ?? "" },
    { query: { enabled: !!sessionId } as any }
  );
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1); // 1 = review, 2 = form, 3 = success
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    paymentMethod: "cod" as "cod" | "upi",
    notes: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  // ── Step 1: Cart Review ──
  if (isLoading || !sessionId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <StepIndicator step={1} />
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground text-sm mb-6">Add some items before checking out.</p>
        <Link href="/shop">
          <span className="inline-block px-6 py-3 rounded-sm text-sm font-semibold text-white cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)` }}>
            Browse Collections
          </span>
        </Link>
      </div>
    );
  }

  // ── Step 3: Success ──
  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <StepIndicator step={3} />
      <div className="rounded-2xl p-10 shadow-lg" style={{ background: "linear-gradient(135deg, #fdf8ef, #fff)", border: `1px solid rgba(206,165,59,0.2)` }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)` }}>
          <CheckCircle size={36} className="text-white" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} style={{ color: GOLD }} />
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1a1209" }}>
            Order Placed!
          </h1>
          <Sparkles size={16} style={{ color: GOLD }} />
        </div>
          <p className="text-muted-foreground text-sm mb-4">
            Thank you for shopping with ANVI! We'll confirm your order shortly.
          </p>
          <div className="rounded-xl px-6 py-4 mb-6" style={{ background: `rgba(206,165,59,0.08)`, border: `1px solid rgba(206,165,59,0.2)` }}>
            <p className="text-xs text-muted-foreground mb-1">Order Number</p>
            <p className="font-bold text-lg font-mono" style={{ color: GOLD }}>{orderNumber}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
          <Phone size={13} style={{ color: GOLD }} />
          For queries, call us at <strong>9442282319</strong> or <strong>8072454583</strong>
        </p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop">
              <span className="inline-block px-6 py-3 rounded-sm text-sm font-semibold cursor-pointer border" style={{ borderColor: GOLD, color: GOLD }}>
                Continue Shopping
              </span>
            </Link>
            <Link href="/">
              <span className="inline-block px-6 py-3 rounded-sm text-sm font-semibold text-white cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)` }}>
                Go Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Submit Order ──
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          address: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode },
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");
      setOrderNumber(data.orderNumber);
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId: sessionId ?? "" }) });
      setStep(3);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 transition-all";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <StepIndicator step={step} />

      {step === 1 && (
        /* ── Cart Review ── */
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-semibold text-foreground mb-4">Review Your Cart</h2>
            {cart.items.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground line-clamp-2">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Size: {item.size} · Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold mt-2" style={{ color: GOLD }}>{formatPrice(item.price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="rounded-2xl p-6 sticky top-24 border border-border"
              style={{ background: "linear-gradient(135deg, #fdf8ef, #fff)" }}>
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-5">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: GOLD }}>{formatPrice(cart.subtotal)}</span>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)`, boxShadow: `0 4px 20px rgba(206,165,59,0.3)` }}
              >
                Proceed to Delivery <ChevronRight size={16} />
              </button>
              <Link href="/cart">
                <span className="block text-center text-xs text-muted-foreground mt-3 hover:text-primary cursor-pointer transition-colors">
                  ← Edit Cart
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        /* ── Delivery Form ── */
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <button type="button" onClick={() => setStep(1)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              ← Back to Cart
            </button>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
        <AlertTriangle size={16} className="flex-shrink-0" />
        {error}
      </div>        
            )}

            {/* Customer Info */}
            <div className="rounded-2xl p-6 border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail size={16} style={{ color: GOLD }} /> Contact Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
                  <input required value={form.customerName} onChange={(e) => set("customerName", e.target.value)}
                    placeholder="Your full name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
                  <input required type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)}
                    placeholder="your@email.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone Number *</label>
                  <input required type="tel" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)}
                    placeholder="9XXXXXXXXX" pattern="[0-9]{10}" title="10-digit phone number" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl p-6 border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin size={16} style={{ color: GOLD }} /> Delivery Address
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Address Line 1 *</label>
                  <input required value={form.line1} onChange={(e) => set("line1", e.target.value)}
                    placeholder="House / Flat No., Street Name" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Address Line 2</label>
                  <input value={form.line2} onChange={(e) => set("line2", e.target.value)}
                    placeholder="Landmark, Area (optional)" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">City *</label>
                  <input required value={form.city} onChange={(e) => set("city", e.target.value)}
                    placeholder="Coimbatore" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Pincode *</label>
                  <input required value={form.pincode} onChange={(e) => set("pincode", e.target.value)}
                    placeholder="641012" pattern="[0-9]{6}" title="6-digit pincode" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">State *</label>
                  <select required value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls}>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl p-6 border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard size={16} style={{ color: GOLD }} /> Payment Method
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive", icon: <Banknote size={20} /> },
                  { value: "upi", label: "UPI / Online", desc: "Pay via UPI / bank transfer", icon: <CreditCard size={20} /> },
                ].map(({ value, label, desc, icon }) => (
                  <label key={value}
                    className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={form.paymentMethod === value ? { borderColor: GOLD, background: `rgba(206,165,59,0.06)` } : { borderColor: "#e5e7eb" }}>
                    <input type="radio" name="payment" value={value} checked={form.paymentMethod === value}
                      onChange={() => set("paymentMethod", value)} className="mt-0.5" />
                    <div className="flex items-start gap-2">
                      <span style={{ color: GOLD }}>{icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                        {value === "upi" && form.paymentMethod === "upi" && (
                          <p className="text-xs mt-1.5 font-medium" style={{ color: GOLD }}>
                            UPI: anviclothing2026@gmail.com
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl p-6 border border-border bg-card">
              <label className="block text-sm font-medium text-foreground mb-2">Order Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)}
                placeholder="Special instructions, colour preferences, etc."
                className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="rounded-2xl p-6 sticky top-24 border border-border"
              style={{ background: "linear-gradient(135deg, #fdf8ef, #fff)" }}>
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-2 text-sm">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-xs line-clamp-1">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Qty {item.quantity} · {item.size}</p>
                    </div>
                    <span className="font-semibold text-xs">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                  <span>Total</span>
                  <span style={{ color: GOLD }}>{formatPrice(cart.subtotal)}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)`, boxShadow: `0 4px 20px rgba(206,165,59,0.3)`, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Placing Order..." : <><ShoppingBag size={16} /> Place Order</>}
              </button>

              <p className="text-xs text-center text-muted-foreground mt-3">
                By placing your order you agree to our terms.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
