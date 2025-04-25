import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Add item to wishlist
 */
export const addToWishlist = async (req, res) => {
  const { menuId } = req.body;
  const userId = req.user?.id;

  if (!menuId) {
    return res.status(400).json({ error: "menuId must be provided" });
  }

  try {
    const menuItem = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_menuId: { userId, menuId },
      },
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        menuId,
      },
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get user's wishlist
 */
export const getWishlist = async (req, res) => {
  const userId = req.user?.id;

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { menu: true }, // include menu info
    });

    if (wishlist.length === 0) {
      return res.status(404).json({ message: "Your wishlist is empty" });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (req, res) => {
  const { wishlistItemId } = req.params;
  const userId = req.user?.id;

  try {
    const wishlistItem = await prisma.wishlist.findUnique({
      where: { id: parseInt(wishlistItemId) },
    });

    if (!wishlistItem || wishlistItem.userId !== userId) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    await prisma.wishlist.delete({
      where: { id: parseInt(wishlistItemId) },
    });

    res.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get total number of items in user's wishlist
 */
export const getWishlistCount = async (req, res) => {
  const userId = req.user?.id;

  try {
    const count = await prisma.wishlist.count({
      where: { userId },
    });

    res.json({ count });
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
