import express from "express";

import {
  cancelReservation,
  createReservation,
  getUserReservations,
} from "../controller/ReservationController.js";
import authenticateUser from "../middleware/verifyJWT.js";

const reservationRouter = express.Router();

// Protect the routes with the authenticateUser middleware
reservationRouter.post("/create", authenticateUser, createReservation); // Book a reservation (requires authentication)
reservationRouter.put("/:id/cancel", authenticateUser, cancelReservation); // Cancel a reservation (requires authentication)
reservationRouter.get("/get", authenticateUser, getUserReservations); // Get user's reservations

export default reservationRouter;
