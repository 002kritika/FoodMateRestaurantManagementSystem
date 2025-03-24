const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        });
        if (!menuItem)
          throw new Error(`Menu item not found: ${item.menuItemId}`);
        return { menuItemId: item.menuItemId, quantity: item.quantity };
      })
    );

    const total = orderItems.reduce((sum, item) => sum + item.quantity * 10, 0); // Sample calculation

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
