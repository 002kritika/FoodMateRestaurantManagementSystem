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
      "PREPARING",
      "COMPLETED",
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
export const getCustomerOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Customer Order Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
};
export const getLatestOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        createdAt: true,
        status: true,
      },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch latest orders" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // directly from middleware

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Fetch details of all items in an order
export const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params; // Extract orderId from request params

    // Find the order with its associated items and menu details
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: {
          include: {
            menu: true, // Include the menu details (name, price, etc.)
          },
        },
      },
    });

    // If order not found, return error
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the order with item details
    res.status(200).json({ orderItems: order.items });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ message: "Failed to fetch order items" });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status === "CANCELED") {
      return res.status(400).json({ message: "Order already canceled" });
    }

    const orderCreatedTime = new Date(order.createdAt);
    const currentTime = new Date();
    const timeDiffInMinutes = (currentTime - orderCreatedTime) / (1000 * 60); // milliseconds to minutes

    // Apply time-based restrictions
    if (order.paymentMethod === "ESEWA" && order.orderType === "PICKUP") {
      if (timeDiffInMinutes > 10) {
        return res
          .status(400)
          .json({
            message: "Cannot cancel after 10 minutes for paid pickup orders",
          });
      }
    } else if (order.paymentMethod === "CASH_ON_DELIVERY") {
      if (timeDiffInMinutes > 30) {
        return res
          .status(400)
          .json({
            message:
              "Cannot cancel after 30 minutes for cash on delivery orders",
          });
      }
    }

    // Update order status to canceled
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "CANCELED" },
    });

    return res
      .status(200)
      .json({ message: "Order canceled successfully", order: updatedOrder });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
