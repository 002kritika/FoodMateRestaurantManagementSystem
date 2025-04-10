import express from "express";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

profileRoutes;
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes, orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customer", profileRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

const createDefaultAdmin = async () => {
  try {
    const adminExists = await prisma.admin.findUnique({
      where: { email: "admin@example.com" }, // ✅ Use email (unique field)
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.admin.create({
        data: {
          email: "admin@example.com",
          name: "Admin", // You can still set a name, but it’s not unique
          password: hashedPassword,
        },
      });
      console.log("✅ Default admin created: admin@example.com / admin123");
    } else {
      console.log("ℹ Default admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

// Call the function on server startup
createDefaultAdmin();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
