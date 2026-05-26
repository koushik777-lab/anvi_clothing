import { Router, type Request, type Response } from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Cart } from "../models/Cart.js";
import mongoose from "mongoose";

const router = Router();

// GET /api/products
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, onSale, featured, page = "1", limit = "12" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (onSale === "true") filter.onSale = true;
    if (featured === "true") filter.featured = true;
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/featured
router.get("/featured", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ featured: true }).limit(8).lean();
    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Error fetching featured products");
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

// GET /api/products/sale
router.get("/sale", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ onSale: true }).limit(12).lean();
    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Error fetching sale products");
    res.status(500).json({ error: "Failed to fetch sale products" });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Error fetching product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET /api/categories
router.get("/categories/all", async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().lean();
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat.slug });
        return { ...cat, productCount };
      }),
    );
    res.json(categoriesWithCount);
  } catch (err) {
    req.log.error({ err }, "Error fetching categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/store/summary
router.get("/store/summary", async (req: Request, res: Response) => {
  try {
    const [totalProducts, totalCategories, saleCount, featuredCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.countDocuments({ onSale: true }),
      Product.countDocuments({ featured: true }),
    ]);
    res.json({ totalProducts, totalCategories, saleCount, featuredCount });
  } catch (err) {
    req.log.error({ err }, "Error fetching store summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
