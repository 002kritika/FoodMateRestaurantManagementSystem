import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    if (!customer) return res.status(404).json("Customer not found");

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { menu: true }, // Include menu details
    });

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { menu: true }, // Include menu details
    });

    res.json({ customer, orders, cart: cartItems });
  } catch (error) {
    res.status(500).json("Error fetching profile");
  }
};

// ✅ Get User Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets `req.user`

    const profile = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create Profile (if not exists)
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone, dob, gender } = req.body;

    // Check if profile exists
    const existingProfile = await prisma.customer.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // Create new profile
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
    res.status(500).json({ error: "Failed to create profile" });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone, dob, gender } = req.body;

    // Check if profile exists
    const profile = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile
    const updatedProfile = await prisma.customer.update({
      where: { userId },
      data: { name, address, phone, dob: new Date(dob), gender },
    });

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};
