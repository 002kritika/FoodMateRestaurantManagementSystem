import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

const prisma = new PrismaClient();

// Fetch Dashboard Summary
export const getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });
    const totalUsers = await prisma.customer.count();
    const totalMenu = await prisma.menu.count(); // Added query for totalMenu

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    res.json({ totalOrders, totalUsers, totalMenu, totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard summary." });
  }
};

// Fetch Daily Orders
export const getDailyOrders = async (req, res) => {
  try {
    const today = new Date();
    const dailyOrders = [];

    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const count = await prisma.order.count({
        where: {
          createdAt: { gte: startOfDay(day), lt: endOfDay(day) },
        },
      });

      dailyOrders.push({ day: format(day, "EEE"), count });
    }

    res.json(dailyOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily orders." });
  }
};

// Fetch Monthly Revenue
export const getMonthlyRevenue = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;
    const result = [];

    for (let month = 0; month < 12; month++) {
      const startThisYear = new Date(currentYear, month, 1);
      const startNextMonthThisYear = new Date(currentYear, month + 1, 1);
      const startLastYear = new Date(prevYear, month, 1);
      const startNextMonthLastYear = new Date(prevYear, month + 1, 1);

      const revenueThisYearResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startThisYear, lt: startNextMonthThisYear },
        },
      });

      const revenueLastYearResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startLastYear, lt: startNextMonthLastYear },
        },
      });

      result.push({
        month: format(startThisYear, "MMM"),
        revenue2024: revenueLastYearResult?._sum.totalAmount || 0,
        revenue2025: revenueThisYearResult?._sum.totalAmount || 0,
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly revenue." });
  }
};

// Fetch Customer Map (Grouped by Address)
export const getCustomerMap = async (req, res) => {
  try {
    const customers = await prisma.customer.groupBy({
      by: ["address"],
      _count: true,
    });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ error: "No customer data found." });
    }

    const data = customers.map((c) => ({ region: c.address, count: c._count }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer map." });
  }
};

// Fetch New Users and Orders (Last 7 Days)
export const getNewUsersAndOrders = async (req, res) => {
  try {
    const oneWeekAgo = subDays(new Date(), 7);

    // Get new users from last 7 days (isAdmin = false)
    const newUsers = await prisma.user.findMany({
      where: {
        isAdmin: false,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get new orders from last 7 days
    const newOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Send formatted data
    res.json({
      newUsers,
      newOrders,
    });
  } catch (error) {
    console.error("❌ Error in getNewUsersAndOrders:", error);
    res.status(500).json({ error: "Failed to fetch new users and orders" });
  }
};
