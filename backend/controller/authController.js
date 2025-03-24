import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate Token
    const token = jwt.sign({ adminId: admin.id }, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });

    // Set cookie with HttpOnly flag
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

export { adminLogin };
