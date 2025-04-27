import express from "express";
import { adminLogin } from "../controller/authController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
  getMenuItems,
} from "../controller/menuController.js";
import {
  getCustomerMap,
  getDailyOrders,
  getDashboardSummary,
  getMonthlyRevenue,
  getNewUsersAndOrders,
} from "../controller/DashboardController.js";
import {
  confirmReservation,
  getAllUserReservations,
} from "../controller/ReservationController.js";
// import { getDashboardStats } from "../controller/DashboardController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/menu", authenticateAdmin, createMenuItem);
adminRouter.put("/menu/:id", authenticateAdmin, updateMenuItem);
adminRouter.delete("/menu/:id", authenticateAdmin, deleteMenuItem);
adminRouter.get("/menu", authenticateAdmin, getMenuItems);
// adminRouter.get("/dashboard/stats", authenticateAdmin, getDashboardStats);
adminRouter.get("/summary", authenticateAdmin, getDashboardSummary);
adminRouter.get("/orders/daily", authenticateAdmin, getDailyOrders);
adminRouter.get("/revenue/monthly", authenticateAdmin, getMonthlyRevenue);
adminRouter.get("/customers/map", authenticateAdmin, getCustomerMap);
adminRouter.get("/new-activity", authenticateAdmin, getNewUsersAndOrders);
adminRouter.get("/reservations", authenticateAdmin, getAllUserReservations);
adminRouter.put(
  "/reservations/:id/confirm",
  authenticateAdmin,
  confirmReservation
);
export default adminRouter;
