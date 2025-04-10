import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controller/cartController.js";
import authenticateUser from "../middleware/verifyJWT.js";

const cartRouter = express.Router();

cartRouter.post("/add", authenticateUser, addToCart);
cartRouter.get("/", authenticateUser, getCart);
cartRouter.delete("/remove/:cartItemId", authenticateUser, removeFromCart);
cartRouter.put("/update/:cartItemId", authenticateUser, updateCartItem);
export default cartRouter;
