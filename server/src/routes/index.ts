import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import cartRouter from "./cart.js";
import storeRouter from "./store.js";
import adminRouter from "./admin.js";
import ordersRouter from "./orders.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/cart", cartRouter);
router.use("/store", storeRouter);
router.use("/admin", adminRouter);
router.use("/orders", ordersRouter);

export default router;
