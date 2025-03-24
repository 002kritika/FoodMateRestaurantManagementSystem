import express from "express";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
