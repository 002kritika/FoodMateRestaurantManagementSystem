// routes/paymentRoutes.js
import express from "express";
import {
  initiatePayment,
  handleSuccess,
  getOrderDetails,
} from "../controller/paymentController.js";
import authenticateUser from "../middleware/verifyJWT.js";

const paymentRouter = express.Router();

paymentRouter.post("/initiate", authenticateUser, initiatePayment);
paymentRouter.get("/success", handleSuccess);
paymentRouter.get("/order-details", getOrderDetails); // <-- new endpoint

export default paymentRouter;
