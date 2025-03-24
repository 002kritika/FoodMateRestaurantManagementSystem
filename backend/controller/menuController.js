import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Middleware to check if the user is an admin
const isAdmin = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, "casdkjfqheiru23");
    return decoded.user.role === "ADMIN";
  } catch (error) {
    return false;
  }
};

// Create a new menu item (Admin only)
const createMenuItem = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name, description, price, category } = req.body;

  try {
    const menuItem = await prisma.menu.create({
      data: { name, description, price, category },
    });
    res.status(201).json({ message: "Menu item created", menuItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating menu item", error: error.message });
  }
};

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany();
    res.status(200).json(menuItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu items", error: error.message });
  }
};

// Update a menu item (Admin only)
const updateMenuItem = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const { id } = req.params;
  const { name, description, price, category, available } = req.body;

  try {
    const menuItem = await prisma.menu.update({
      where: { id },
      data: { name, description, price, category, available },
    });
    res.json({ message: "Menu item updated", menuItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating menu item", error: error.message });
  }
};

// Delete a menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const { id } = req.params;

  try {
    await prisma.menu.delete({ where: { id } });
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: error.message });
  }
};

export { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem };
