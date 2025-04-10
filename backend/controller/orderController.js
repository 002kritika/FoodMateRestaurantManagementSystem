import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod, orderType } = req.body;

    // Validate input
    if (!paymentMethod || !orderType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (orderType === "DELIVERY" && !address) {
      return res
        .status(400)
        .json({ message: "Address is required for delivery" });
    }

    // Fetch customer
    let customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update address only if delivery
    if (orderType === "DELIVERY") {
      customer = await prisma.customer.update({
        where: { userId },
        data: { address },
      });
    }

    // Get cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { menu: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const deliveryCharge = orderType === "DELIVERY" ? 150 : 0;
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.menu.price,
      0
    );

    // Create order and connect user
    const order = await prisma.order.create({
      data: {
        totalAmount: totalAmount + deliveryCharge,
        paymentMethod,
        address: orderType === "DELIVERY" ? address : null,
        orderType,
        status: "PENDING",
        deliveryCharge,
        user: {
          connect: { id: userId }, // Connect user by userId
        },
        items: {
          create: cartItems.map((item) => ({
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.menu.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear the cart after placing the order
    await prisma.cart.deleteMany({ where: { userId } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order Error:", error); // Check terminal logs for error details
    res.status(500).json({ message: "Failed to place order" });
  }
};

// --------------------- GET ALL ORDERS (ADMIN) ---------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    res.status(200).json({ message: "Order status updated", order: updated });
  } catch (error) {
    console.error("❌ Update Order Status Error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
