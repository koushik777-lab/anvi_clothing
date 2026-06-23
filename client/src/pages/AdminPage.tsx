import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Package, Tag, ShoppingBag, LogOut,
  Plus, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight,
  Eye, EyeOff, Search, Upload, AlertCircle, Sparkles, Store, Flower2, Star,
} from "lucide-react";
import {
  getAdminToken, setAdminToken, clearAdminToken,
  adminLogin, getDashboard,
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  getAdminCategories, createCategory, updateCategory, deleteCategory,
  getAdminOrders, updateOrderStatus,
} from "@/lib/adminApi";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  _id: string; name: string; slug: string; price: number; originalPrice?: number;
  discount?: number; images: string[]; category: string; fabric?: string;
  sizes: string[]; inStock: boolean; featured: boolean; onSale: boolean;
  tags: string[]; description?: string;
}
interface Category { _id: string; name: string; slug: string; image?: string; description?: string; productCount?: number; }
interface Order {
  _id: string; orderNumber: string; customerName: string; customerEmail: string;
  customerPhone: string; total: number; status: string; createdAt: string;
  items: { name: string; quantity: number; price: number; size: string }[];
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const GOLD = "#cea53b";
const DARK = "#1a1209";

function goldenBtn(extra = "") {
  return `px-4 py-2 rounded text-white text-sm font-semibold transition-all hover:opacity-90 ${extra}`;
}

// ─── Admin Login Page ────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminLogin(email, password);
      setAdminToken(token);
      onLogin();
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fdf8ef 0%, #f5ecd7 100%)" }}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ boxShadow: `0 20px 60px rgba(206,165,59,0.18)` }}>
          {/* Header */}
          <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${DARK}, #2d1f07)` }}>
            <img
              src="/anvi_logo.png"
              alt="Anvi Clothing"
              className="h-28 mx-auto mb-4 object-contain transition-all duration-300 ease-in-out hover:scale-105 filter hover:drop-shadow-[0_4px_12px_rgba(206,165,59,0.25)]"
            />
            <p className="text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5" style={{ color: GOLD }}>
              <Sparkles size={13} /> Admin Panel <Sparkles size={13} />
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <p className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2 justify-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <Flower2 size={18} style={{ color: GOLD }} /> Admin Sign In
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@anviclothing.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ ["--tw-ring-color" as string]: GOLD } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ ["--tw-ring-color" as string]: GOLD } as React.CSSProperties}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-all ${loading ? "opacity-70" : "hover:opacity-90"}`}
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)`, boxShadow: `0 4px 20px rgba(206,165,59,0.35)` }}
              >
                {loading ? "Signing in..." : "Sign In to Admin"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              <a href="/" className="hover:underline">← Back to website</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];

function Sidebar({ active, setActive, onLogout }: { active: string; setActive: (s: string) => void; onLogout: () => void }) {
  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: DARK, boxShadow: "4px 0 20px rgba(0,0,0,0.25)" }}>
      {/* Logo */}
      <div className="p-6 border-b text-center" style={{ borderColor: "rgba(206,165,59,0.15)" }}>
        <img
          src="/anvi_logo.png"
          alt="Anvi Clothing"
          className="h-20 w-auto mx-auto object-contain transition-all duration-300 ease-in-out hover:scale-105 filter hover:drop-shadow-[0_2px_8px_rgba(206,165,59,0.2)]"
        />
        <p className="text-xs mt-3 font-semibold tracking-widest uppercase" style={{ color: GOLD }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id} onClick={() => setActive(id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
            style={active === id
              ? { background: `rgba(206,165,59,0.15)`, color: GOLD, borderLeft: `3px solid ${GOLD}` }
              : { color: "rgba(255,255,255,0.6)", borderLeft: "3px solid transparent" }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(206,165,59,0.1)" }}>
        <a href="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 mb-3 transition-colors">
          ← Back to Store
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Total Products", value: stats.totalProducts, color: "#4ade80" },
    { label: "Total Categories", value: stats.totalCategories, color: GOLD },
    { label: "Total Orders", value: stats.totalOrders, color: "#60a5fa" },
    { label: "Pending Orders", value: stats.pendingOrders, color: "#f87171" },
    { label: "Total Revenue", value: `₹${(stats.totalRevenue ?? 0).toLocaleString("en-IN")}`, color: GOLD },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dashboard</h1>
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl p-5 bg-white shadow-sm border border-gray-100 hover:-translate-y-0.5 transition-transform">
              <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
              <p className="text-xs text-gray-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      {stats?.recentOrders?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-700 text-sm">Recent Orders</div>
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="px-6 py-3 text-left">Order #</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr></thead>
            <tbody>
              {stats.recentOrders.map((o: Order) => (
                <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-3">{o.customerName}</td>
                  <td className="px-6 py-3 font-semibold">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

function ProductFormModal({
  product, categories, onClose, onSaved,
}: {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: String(product?.price ?? ""),
    originalPrice: String(product?.originalPrice ?? ""),
    discount: String(product?.discount ?? ""),
    category: product?.category ?? (categories[0]?.slug ?? ""),
    fabric: product?.fabric ?? "",
    sizes: product?.sizes ?? [],
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    onSale: product?.onSale ?? false,
    tags: (product?.tags ?? []).join(", "),
    imageUrls: (product?.images ?? []).join("\n"),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingProdImage, setUploadingProdImage] = useState(false);

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const fileArray = Array.from(files);

    const invalidFiles = fileArray.filter((f) => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      alert("Some files were skipped. Only .png, .jpeg, and .jpg images are allowed.");
    }
    const targetFiles = fileArray.filter((f) => validTypes.includes(f.type));
    if (targetFiles.length === 0) return;

    setUploadingProdImage(true);
    try {
      const urls: string[] = [];
      for (const file of targetFiles) {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": getAdminToken() ?? "",
          },
          body: JSON.stringify({ name: file.name, data: base64String }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Upload failed");
        }
        const data = await res.json();
        urls.push(data.url);
      }

      setForm((f) => {
        const current = f.imageUrls.split("\n").filter(Boolean);
        const updated = [...current, ...urls].join("\n");
        return { ...f, imageUrls: updated };
      });
    } catch (err: any) {
      alert(err.message ?? "Failed to upload image(s)");
    } finally {
      setUploadingProdImage(false);
      e.target.value = "";
    }
  };

  const toggleSize = (s: string) =>
    setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const images = form.imageUrls.split("\n").map((u) => u.trim()).filter(Boolean);
      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        images,
        category: form.category,
        fabric: form.fabric,
        sizes: form.sizes,
        inStock: form.inStock,
        featured: form.featured,
        onSale: form.onSale,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (isEdit && product) await updateProduct(product._id, data);
      else await createProduct(data);
      onSaved();
    } catch (err: any) {
      setError(err.message ?? "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200 flex gap-2"><AlertCircle size={16} />{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹) *</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fabric</label>
              <input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
          </div>

          {/* Image URLs & Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Image URLs <span className="text-gray-400">(one per line — 1st is primary)</span>
              </label>
              <textarea rows={4} value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none font-mono text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Upload Image Files <span className="text-gray-400">(.png, .jpg, .jpeg)</span>
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg h-[92px] hover:border-yellow-400 transition-colors flex flex-col items-center justify-center relative cursor-pointer bg-gray-50/50">
                <input type="file" multiple accept=".png,.jpg,.jpeg" onChange={handleProductImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload size={20} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 font-medium">{uploadingProdImage ? "Uploading..." : "Click or Drag to Upload"}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Multiple files supported</span>
              </div>
            </div>
          </div>
          {/* Preview */}
          {form.imageUrls.split("\n").filter(Boolean).length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.imageUrls.split("\n").map((u, i) => u.trim() && (
                <div key={i} className="relative">
                  <img src={u.trim()} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  {i === 0 && <span className="absolute -top-1 -right-1 text-[9px] bg-yellow-400 text-white rounded-full px-1 font-bold">1st</span>}
                </div>
              ))}
            </div>
          )}

          {/* Sizes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={form.sizes.includes(s)
                    ? { background: GOLD, borderColor: GOLD, color: "#fff" }
                    : { background: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tags <span className="text-gray-400">(comma-separated)</span></label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="salwar, cotton, summer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[["inStock", "In Stock"], ["featured", "Featured"], ["onSale", "On Sale"]].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <div onClick={() => setForm({ ...form, [key]: !(form as any)[key] })}
                  className="w-10 h-5 rounded-full flex items-center transition-all px-0.5"
                  style={{ background: (form as any)[key] ? GOLD : "#e5e7eb" }}>
                  <div className="w-4 h-4 bg-white rounded-full shadow transition-all" style={{ marginLeft: (form as any)[key] ? "20px" : "0" }} />
                </div>
                <span className="text-gray-600">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)` }}>
              {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Products Table ───────────────────────────────────────────────────────────

function ProductsTab() {
  const [data, setData] = useState<{ products: Product[]; total: number; pages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<{ open: boolean; product?: Product | null }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      getAdminProducts({ page, limit: 15, search: search || undefined }),
      getAdminCategories(),
    ]).then(([p, c]) => { setData(p); setCategories(c); }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try { await deleteProduct(id); load(); } catch {} finally { setDeleting(false); setDeleteId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Products</h1>
        <button onClick={() => setModal({ open: true, product: null })}
          className={goldenBtn("flex items-center gap-2")}
          style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)`, boxShadow: `0 4px 15px rgba(206,165,59,0.3)` }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
          placeholder="Search products… (press Enter)"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td colSpan={7} className="px-4 py-3"><div className="h-8 bg-gray-100 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : data?.products.map((p) => (
                <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <img src={p.images[0]} alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/anvi_logo.png"; }} />
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                    {p.onSale && <span className="text-xs text-orange-500 font-medium">ON SALE</span>}
                  </td>
                  <td className="px-4 py-2.5 capitalize text-gray-500">{p.category.replace(/-/g, " ")}</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-700">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {p.featured ? <Check size={16} className="mx-auto text-green-500" /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setModal({ open: true, product: p })}
                        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteId(p._id)}
                        className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && data?.products.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing {data.products.length} of {data.total} products</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"><ChevronLeft size={14} /></button>
              <span className="text-sm text-gray-600 px-2 py-1">Page {page} of {data.pages}</span>
              <button disabled={page >= data.pages} onClick={() => setPage(p => p + 1)}
                className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Product modal */}
      {modal.open && (
        <ProductFormModal
          product={modal.product}
          categories={categories}
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); load(); }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Delete Product?</h3>
              <p className="text-gray-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; cat?: Category | null }>({ open: false });
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAdminCategories().then(setCats).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openModal = (cat?: Category | null) => {
    setForm({ name: cat?.name ?? "", description: cat?.description ?? "", image: cat?.image ?? "" });
    setModal({ open: true, cat });
  };

  const [uploadingCatImage, setUploadingCatImage] = useState(false);

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only .png, .jpeg, and .jpg images are allowed.");
      return;
    }

    setUploadingCatImage(true);
    try {
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": getAdminToken() ?? "",
        },
        body: JSON.stringify({ name: file.name, data: base64String }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }
      const data = await res.json();
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err: any) {
      alert(err.message ?? "Failed to upload image");
    } finally {
      setUploadingCatImage(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.cat) await updateCategory(modal.cat._id, form);
      else await createCategory(form);
      setModal({ open: false });
      load();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteCategory(id); load(); } catch {} finally { setDeleteId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Categories</h1>
        <button onClick={() => openModal(null)}
          className={goldenBtn("flex items-center gap-2")}
          style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)`, boxShadow: `0 4px 15px rgba(206,165,59,0.3)` }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(6)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
        )) : cats.map((cat) => (
          <div key={cat._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {cat.image ? (
              <div className="h-28 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fdf8ef, #f5ecd7)" }}>
                <span className="text-4xl font-bold" style={{ color: GOLD }}>{cat.name.charAt(0)}</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.productCount ?? 0} products</p>
                </div>
                <div className="flex gap-1.5 mt-0.5">
                  <button onClick={() => openModal(cat)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteId(cat._id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{modal.cat ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setModal({ open: false })} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Upload Image File <span className="text-gray-400">(.png, .jpg, .jpeg)</span>
                  </label>
                  <div className="relative border border-dashed border-gray-300 rounded-lg px-3 py-2 text-center hover:border-yellow-400 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[42px] bg-gray-50/50">
                    <input type="file" accept=".png,.jpg,.jpeg" onChange={handleCategoryImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                      <Upload size={14} /> {uploadingCatImage ? "Uploading..." : "Choose File"}
                    </span>
                  </div>
                </div>
              </div>
              {form.image && <img src={form.image} alt="" className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal({ open: false })} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #e0bc5a)` }}>
                  {saving ? "Saving..." : modal.cat ? "Update" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Delete Category?</h3>
            <p className="text-gray-500 text-sm mb-4">This will not delete existing products.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [data, setData] = useState<{ orders: Order[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = () => {
    setLoading(true);
    getAdminOrders().then(setData).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    load();
    setSelected(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Orders <span className="text-base font-normal text-gray-400">({data?.total ?? 0} total)</span>
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t"><td colSpan={7} className="px-4 py-3"><div className="h-8 bg-gray-100 animate-pulse rounded" /></td></tr>
              )) : data?.orders.map((o) => (
                <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: GOLD }}>{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 font-semibold">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 capitalize text-xs text-gray-500">{(o as any).paymentMethod ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelected(o)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
              {!loading && !data?.orders.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Order {selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Customer</p><p className="font-medium">{selected.customerName}</p></div>
                <div><p className="text-xs text-gray-400">Phone</p><p className="font-medium">{selected.customerPhone}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400">Email</p><p className="font-medium">{selected.customerEmail}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400">Address</p>
                  <p className="font-medium">{(selected as any).address?.line1}, {(selected as any).address?.city} - {(selected as any).address?.pincode}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                    <span>{item.name} <span className="text-gray-400">× {item.quantity} ({item.size})</span></span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base mt-2">
                  <span>Total</span><span style={{ color: GOLD }}>₹{selected.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                    <button key={s} onClick={() => handleStatus(selected._id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${selected.status === s ? "border-yellow-400 text-white" : "border-gray-200 text-gray-600 hover:border-yellow-300"}`}
                      style={selected.status === s ? { background: GOLD } : {}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = getAdminToken();
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "products": return <ProductsTab />;
      case "categories": return <CategoriesTab />;
      case "orders": return <OrdersTab />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={activeTab} setActive={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-auto">
        {renderTab()}
      </main>
    </div>
  );
}
