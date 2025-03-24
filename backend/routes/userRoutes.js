import express from "express";
import {
  customerLogin,
  customerRegister,
  verifyEmail,
  sendResetPasswordEmail,
  staffLogin,
  staffRegister,
  adminLogin,
  adminRegister,
  resetPassword,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/customer/login", customerLogin);
userRouter.post("/customer/register", customerRegister);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/forgot-password", sendResetPasswordEmail);
userRouter.post("/staff/login", staffLogin);
userRouter.post("/staff/register", staffRegister);
userRouter.post("/admin/login", adminLogin);
userRouter.post("/admin/register", adminRegister);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
