import { PrismaClient } from "@prisma/client"; // ✅ Correct

import { startOfDay, endOfDay, subDays, format, startOfMonth } from "date-fns";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalDelivered = await prisma.order.count({
      where: { status: "DELIVERED" },
    });
    const totalCanceled = await prisma.order.count({
      where: { status: "CANCELED" },
    });

    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });

    const customerGrowth = await prisma.customer.count();

    res.json({
      totalOrders,
      totalDelivered,
      totalCanceled,
      totalRevenue: totalRevenueResult._sum.totalAmount || 0,
      customerGrowth,
      revenueShare: totalRevenueResult._sum.totalAmount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard summary." });
  }
};

export const getDailyOrders = async (req, res) => {
  try {
    const today = new Date();
    const dailyOrders = [];

    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const count = await prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay(day),
            lt: endOfDay(day),
          },
        },
      });

      dailyOrders.push({
        day: format(day, "EEE"),
        count,
      });
    }

    res.json(dailyOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch daily orders." });
  }
};

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

      const revenueThisYear = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: {
            gte: startThisYear,
            lt: startNextMonthThisYear,
          },
        },
      });

      const revenueLastYear = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: {
            gte: startLastYear,
            lt: startNextMonthLastYear,
          },
        },
      });

      result.push({
        month: format(startThisYear, "MMM"),
        revenue2024: revenueLastYear._sum.totalAmount || 0,
        revenue2025: revenueThisYear._sum.totalAmount || 0,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly revenue." });
  }
};

export const getCustomerMap = async (req, res) => {
  try {
    const customers = await prisma.customer.groupBy({
      by: ["address"],
      _count: true,
    });

    const data = customers.map((c) => ({
      region: c.address,
      count: c._count,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customer map." });
  }
};
