import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getWishlistCount,
} from "../controller/wishlistController.js";
import authenticateUser from "../middleware/verifyJWT.js";

const wishlistRouter = express.Router();
wishlistRouter.post("/add", authenticateUser, addToWishlist);
wishlistRouter.get("/", authenticateUser, getWishlist);
wishlistRouter.delete("/:wishlistItemId", authenticateUser, removeFromWishlist);
wishlistRouter.get("/count", authenticateUser, getWishlistCount);

export default wishlistRouter;
