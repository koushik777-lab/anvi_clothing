// Admin API helper — talks to /api/admin/* with x-admin-token header

const BASE = "/api/admin";

export function getAdminToken(): string | null {
  return localStorage.getItem("anvi_admin_token");
}

export function setAdminToken(token: string): void {
  localStorage.setItem("anvi_admin_token", token);
}

export function clearAdminToken(): void {
  localStorage.removeItem("anvi_admin_token");
}

async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-admin-token": token } : {}),
      ...(options.headers ?? {}),
    },
  });
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json() as Promise<{ token: string; email: string }>;
}

export async function getDashboard() {
  const res = await adminFetch("/dashboard");
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

// Products
export async function getAdminProducts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.category) q.set("category", params.category);
  if (params?.search) q.set("search", params.search);
  const res = await adminFetch(`/products?${q}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function createProduct(data: Record<string, unknown>) {
  const res = await adminFetch("/products", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
  return res.json();
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await adminFetch(`/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

// Categories
export async function getAdminCategories() {
  const res = await adminFetch("/categories");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function createCategory(data: Record<string, unknown>) {
  const res = await adminFetch("/categories", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
  return res.json();
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await adminFetch(`/categories/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

// Orders
export async function getAdminOrders(params?: { page?: number; status?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.status) q.set("status", params.status);
  const res = await adminFetch(`/orders?${q}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await adminFetch(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
