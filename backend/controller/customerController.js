// In your backend controller (e.g., CustomerController.js)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Endpoint to fetch the customer address
export const getCustomerAddress = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets `req.user`

    // Fetch the customer based on the userId (from the logged-in user)
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ address: customer.address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

// Endpoint to update the customer address
export const updateCustomerAddress = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets `req.user`

    // Fetch the customer based on the userId (from the logged-in user)

    const { address } = req.body;

    // Validate address
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Update the customer address
    const updatedCustomer = await prisma.customer.update({
      where: { userId },

      data: { address },
    });

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedCustomer.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update address" });
  }
};
