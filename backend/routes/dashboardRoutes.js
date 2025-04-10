// routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", authenticateAdmin, getDashboardStats);

export default dashboardRouter;
