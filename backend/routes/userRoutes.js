import express from "express";
import {
  customerLogin,
  customerRegister,
  staffLogin,
  staffRegister,
  adminLogin,
  adminRegister,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/customer/login", customerLogin);
userRouter.post("/customer/register", customerRegister);
userRouter.post("/staff/login", staffLogin);
userRouter.post("/staff/register", staffRegister);
userRouter.post("/admin/login", adminLogin);
userRouter.post("/admin/register", adminRegister);

export default userRouter;
