import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Add item to cart
 */
export const addToCart = async (req, res) => {
  const { menuId, quantity } = req.body;
  const userId = req.user?.id;

  if (!menuId || quantity < 1) {
    return res
      .status(400)
      .json({
        error:
          "Invalid input: menuId and quantity must be provided and quantity must be at least 1",
      });
  }

  try {
    // Check if the menu item exists
    const menuItem = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Add or update cart item
    const cartItem = await prisma.cart.upsert({
      where: { userId_menuId: { userId, menuId } }, // Composite key
      update: { quantity: { increment: quantity } },
      create: { userId, menuId, quantity },
    });

    res.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update item in cart
 */
export const updateCartItem = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user?.id;

  if (quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }

  try {
    // Find the cart item
    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(cartItemId) },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Update the quantity
    const updatedCartItem = await prisma.cart.update({
      where: { id: parseInt(cartItemId) },
      data: { quantity },
    });

    res.json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get user's cart items
 */
export const getCart = async (req, res) => {
  const userId = req.user?.id;

  try {
    const cart = await prisma.cart.findMany({
      where: { userId },
      include: { menu: true }, // Fetch menu details
    });

    if (cart.length === 0) {
      return res.status(404).json({ message: "Your cart is empty" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.params;
  const userId = req.user?.id;

  try {
    // Find cart item
    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(cartItemId) },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Delete cart item
    await prisma.cart.delete({ where: { id: parseInt(cartItemId) } });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
