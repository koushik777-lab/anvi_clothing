import { Router, type Request, type Response } from "express";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";

const router = Router();

// POST /api/orders — place an order (checkout)
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      paymentMethod,
      notes,
    } = req.body;

    if (!sessionId || !customerName || !customerEmail || !customerPhone || !address || !paymentMethod) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Fetch cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const orderNumber = `ANVI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      address,
      items: cart.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
        size: i.size,
      })),
      subtotal,
      total: subtotal,
      paymentMethod,
      notes,
      sessionId,
      status: "pending",
    });

    await order.save();

    // Clear cart after placing order
    cart.items = [] as typeof cart.items;
    await cart.save();

    res.status(201).json({ orderNumber: order.orderNumber, _id: order._id, total: order.total });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to place order" });
  }
});

// GET /api/orders/:orderNumber — track an order
router.get("/:orderNumber", async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
