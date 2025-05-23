import express from "express";
import {
  getCustomerMap,
  getDailyOrders,
  getDashboardSummary,
  getMonthlyRevenue,
  getNewUsersAndOrders,
} from "../controller/DashboardController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/summary", authenticateAdmin, getDashboardSummary);
dashboardRouter.get("/orders/daily", authenticateAdmin, getDailyOrders);
dashboardRouter.get("/revenue/monthly", authenticateAdmin, getMonthlyRevenue);
dashboardRouter.get("/customers/map", authenticateAdmin, getCustomerMap);
dashboardRouter.get("/new-activity", authenticateAdmin, getNewUsersAndOrders);
export default dashboardRouter;
