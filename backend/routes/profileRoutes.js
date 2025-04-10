import express from "express";
import authenticateUser from "../middleware/verifyJWT.js";
import {
  getCustomerProfile,
  getProfile,
  createProfile,
  updateProfile,
} from "../controller/profileController.js";
import {
  getCustomerAddress,
  updateCustomerAddress,
} from "../controller/customerController.js";

const profileRouter = express.Router();

profileRouter.get("/getprofile", authenticateUser, getCustomerProfile);
profileRouter.get("/address", authenticateUser, getCustomerAddress);
profileRouter.put("/address/update", authenticateUser, updateCustomerAddress);

profileRouter.get("/profile", authenticateUser, getProfile);
profileRouter.post("/profile", authenticateUser, createProfile);
profileRouter.put("/profile", authenticateUser, updateProfile);

export default profileRouter;
