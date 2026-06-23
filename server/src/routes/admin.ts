import { Router, type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";

const router = Router();

// ─── Auth Middleware ─────────────────────────────────────────────────────────

function requireAdmin(req: Request, res: Response, next: () => void) {
  const token = req.headers["x-admin-token"];
  const expected = Buffer.from(
    `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}`
  ).toString("base64");
  if (token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ─── POST /api/admin/login ───────────────────────────────────────────────────

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = Buffer.from(
      `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}`
    ).toString("base64");
    res.json({ token, email });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ─── GET /api/admin/dashboard ────────────────────────────────────────────────

router.get("/dashboard", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [totalProducts, totalCategories, totalOrders, pendingOrders, recentOrders] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;
    res.json({ totalProducts, totalCategories, totalOrders, pendingOrders, totalRevenue, recentOrders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// ─── PRODUCTS CRUD ───────────────────────────────────────────────────────────

// GET /api/admin/products
router.get("/products", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20", category, search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();
    res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/admin/products
router.post("/products", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, discount, images, category,
      fabric, sizes, inStock, featured, onSale, tags } = req.body;
    if (!name || !price || !category) {
      res.status(400).json({ error: "name, price and category are required" });
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
      "-" + Date.now();
    const product = new Product({
      name, slug, description, price, originalPrice, discount,
      images: Array.isArray(images) ? images : [],
      category, fabric,
      sizes: Array.isArray(sizes) ? sizes : [],
      inStock: inStock ?? true,
      featured: featured ?? false,
      onSale: onSale ?? false,
      tags: Array.isArray(tags) ? tags : [],
    });
    await product.save();
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to create product" });
  }
});

// PUT /api/admin/products/:id
router.put("/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, discount, images, category,
      fabric, sizes, inStock, featured, onSale, tags } = req.body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) {
      update.name = name;
      update.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (originalPrice !== undefined) update.originalPrice = originalPrice;
    if (discount !== undefined) update.discount = discount;
    if (images !== undefined) update.images = Array.isArray(images) ? images : [];
    if (category !== undefined) update.category = category;
    if (fabric !== undefined) update.fabric = fabric;
    if (sizes !== undefined) update.sizes = Array.isArray(sizes) ? sizes : [];
    if (inStock !== undefined) update.inStock = inStock;
    if (featured !== undefined) update.featured = featured;
    if (onSale !== undefined) update.onSale = onSale;
    if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : [];
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to update product" });
  }
});

// DELETE /api/admin/products/:id
router.delete("/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ─── CATEGORIES CRUD ─────────────────────────────────────────────────────────

// GET /api/admin/categories
router.get("/categories", requireAdmin, async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().lean();
    const withCount = await Promise.all(
      categories.map(async (cat) => ({
        ...cat,
        productCount: await Product.countDocuments({ category: cat.slug }),
      }))
    );
    res.json(withCount);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST /api/admin/categories
router.post("/categories", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    if (!name) { res.status(400).json({ error: "name is required" }); return; }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const cat = new Category({ name, slug, description, image });
    await cat.save();
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to create category" });
  }
});

// PUT /api/admin/categories/:id
router.put("/categories/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) { update.name = name; update.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
    if (description !== undefined) update.description = description;
    if (image !== undefined) update.image = image;
    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!cat) { res.status(404).json({ error: "Category not found" }); return; }
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to update category" });
  }
});

// DELETE /api/admin/categories/:id
router.delete("/categories/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) { res.status(404).json({ error: "Category not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ─── ORDERS (read + status update) ──────────────────────────────────────────

router.get("/orders", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20", status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();
    res.json({ orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id/status", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

// POST /api/admin/upload
router.post("/upload", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, data } = req.body;
    if (!data || typeof data !== "string") {
      res.status(400).json({ error: "Image data is required and must be a base64 string" });
      return;
    }

    const matches = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: "Invalid base64 image data format" });
      return;
    }

    const ext = "." + (matches[1] === "jpeg" ? "jpg" : matches[1]);
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const uploadsDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(filePath, buffer);

    res.json({ url: `/api/uploads/${fileName}` });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to upload image" });
  }
});

export default router;
