import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ Get Basic User Profile for navbar
 * (name and email from `user` table)
 */
export const getBasicUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Get Detailed Customer Profile (with orders & cart)
 */
export const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      },
    });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { menu: true },
    });

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { menu: true },
    });

    res.json({ customer, orders, cart: cartItems });
  } catch (error) {
    console.error("Error fetching detailed profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ✅ Create Customer Profile
 */
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone, dob, gender } = req.body;

    const existingProfile = await prisma.customer.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = await prisma.customer.create({
      data: {
        name,
        address,
        phone,
        dob: new Date(dob),
        gender,
        userId,
      },
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Failed to create profile" });
  }
};

/**
 * ✅ Get Detailed Profile (from `customer` table only)
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error getting customer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Update Customer Profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone, dob, gender } = req.body;

    const profile = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updatedProfile = await prisma.customer.update({
      where: { userId },
      data: { name, address, phone, dob: new Date(dob), gender },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
