import { Router, type Request, type Response } from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";

const router = Router();

function cartToResponse(cart: InstanceType<typeof Cart>) {
  const items = cart.items.map((item) => ({
    _id: item._id.toString(),
    productId: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    size: item.size,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    sessionId: cart.sessionId,
    items,
    subtotal,
    itemCount,
  };
}

// GET /api/cart
router.get("/", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== "string") {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
      await cart.save();
    }
    res.json(cartToResponse(cart));
  } catch (err) {
    req.log.error({ err }, "Error fetching cart");
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart
router.post("/", async (req: Request, res: Response) => {
  try {
    const { sessionId, productId, quantity, size } = req.body;
    if (!sessionId || !productId || !quantity || !size) {
      res.status(400).json({ error: "sessionId, productId, quantity, and size are required" });
      return;
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.size === size,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        _id: new mongoose.Types.ObjectId(),
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        quantity,
        size,
      });
    }

    await cart.save();
    res.json(cartToResponse(cart));
  } catch (err) {
    req.log.error({ err }, "Error adding to cart");
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PATCH /api/cart/:itemId
router.patch("/:itemId", async (req: Request, res: Response) => {
  try {
    const { sessionId, quantity } = req.body;
    if (!sessionId || quantity === undefined) {
      res.status(400).json({ error: "sessionId and quantity are required" });
      return;
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId) as typeof cart.items;
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cartToResponse(cart));
  } catch (err) {
    req.log.error({ err }, "Error updating cart item");
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE /api/cart/:itemId
router.delete("/:itemId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId) as typeof cart.items;
    await cart.save();
    res.json(cartToResponse(cart));
  } catch (err) {
    req.log.error({ err }, "Error removing cart item");
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

export default router;
