import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();

    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const getRevenueAndCount = async (startDate) => {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      });
      const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      return {
        count: orders.length,
        revenue: total,
      };
    };

    const [dayStats, weekStats, monthStats, yearStats] = await Promise.all([
      getRevenueAndCount(startOfDay),
      getRevenueAndCount(startOfWeek),
      getRevenueAndCount(startOfMonth),
      getRevenueAndCount(startOfYear),
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      stats: {
        day: dayStats,
        week: weekStats,
        month: monthStats,
        year: yearStats,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
