import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import multer from "multer";

const prisma = new PrismaClient();

// Set up multer storage for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Ensure the 'uploads' folder exists
    }
    cb(null, dir); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

const upload = multer({ storage }); // Configure multer with the storage settings

// Middleware for handling file uploads
const uploadImage = upload.single("image"); // Use 'image' field name for the file

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
// Create a new menu item (Admin only)
const createMenuItem = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  uploadImage(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err.message });
    }

    // Debug: Log incoming request data
    console.log("Request Body:", req.body); // Log form data
    console.log("Uploaded File:", req.file); // Log file details

    const { name, description, price, category } = req.body;
    // Convert price to Float
    const priceFloat = parseFloat(price);

    // Check if the price is valid
    if (isNaN(priceFloat)) {
      return res.status(400).json({ message: "Invalid price value" });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get the image URL

    try {
      const menuItem = await prisma.menu.create({
        data: { name, description, price: priceFloat, category, imageUrl },
      });
      res.status(201).json({ message: "Menu item created", menuItem });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating menu item", error: error.message });
    }
  });
};

// Update a menu item (Admin only)
const updateMenuItem = async (req, res) => {
  if (!req.adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  uploadImage(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err.message });
    }

    const { id } = req.params;
    const { name, description, price, category, available } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // Save the new image URL
    }

    try {
      const updatedMenuItem = await prisma.menu.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price), // Ensure price is a float
          category,
          available: available === "true", // Convert to boolean
          ...(imageUrl && { imageUrl }), // Update image only if a new one is uploaded
        },
      });

      res.json({ message: "Menu item updated", updatedMenuItem });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating menu item", error: error.message });
    }
  });
};

const getMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    const menuItems = await prisma.menu.findMany({
      where: category && category !== "ALL" ? { category } : undefined,
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu items", error: error.message });
  }
};

// deleteMenuItem controller
const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete related entries
    await prisma.cart.deleteMany({ where: { menuId: id } });
    await prisma.wishlist.deleteMany({ where: { menuId: id } });
    await prisma.orderItem.deleteMany({ where: { menuId: id } });

    // Then delete the menu item
    await prisma.menu.delete({
      where: { id },
    });

    res.status(200).json({ message: "Menu item deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete menu item." });
  }
};

// Controller to get the top menu items
const getTopMenuItems = async (req, res) => {
  try {
    // Fetch top menu items from the database
    const topMenuItems = await prisma.menu.findMany({
      where: { available: true }, // Filter for items that are available
      orderBy: { price: "desc" }, // Sort items by price in descending order
      take: 15, // Limit to top 5 items (you can adjust this)
    });

    // Return the list of top menu items
    res.status(200).json(topMenuItems);
  } catch (error) {
    console.error("Error fetching top menu items:", error);
    res.status(500).json({ message: "Error fetching top menu items" });
  }
};

export {
  getTopMenuItems,
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  uploadImage,
};
