import express from "express";

import authenticateUser from "../middleware/verifyJWT.js";
import {
  getAllOrders,
  placeOrder,
  updateOrderStatus,
} from "../controller/orderController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/place", authenticateUser, placeOrder);
orderRouter.get("/orders", authenticateAdmin, getAllOrders); // Admin
orderRouter.put(
  "/orders/:orderId/status",
  authenticateAdmin,
  updateOrderStatus
);

// orderRouter.put("/update/:cartItemId", authenticateUser, updateCartItem);

// orderRouter.put("/orders/:orderId/status", authenticateUser, updateOrderStatus);
export default orderRouter;
