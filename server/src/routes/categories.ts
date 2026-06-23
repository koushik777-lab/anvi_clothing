import { Router, type Request, type Response } from "express";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const router = Router();

// GET /api/categories
router.get("/", async (req: Request, res: Response) => {
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

// GET /api/categories/:slug/products
router.get("/:slug/products", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "12" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const total = await Product.countDocuments({ category: req.params.slug });
    const products = await Product.find({ category: req.params.slug })
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
    req.log.error({ err }, "Error fetching category products");
    res.status(500).json({ error: "Failed to fetch category products" });
  }
});

export default router;
