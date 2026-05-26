import { Router, type Request, type Response } from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

const router = Router();

// GET /api/store/summary
router.get("/summary", async (req: Request, res: Response) => {
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
