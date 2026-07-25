import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total Revenue (only paid / delivered orders)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: { $in: ["paid"] },
          orderStatus: { $nin: ["cancelled", "refunded"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Customers
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Low Stock Alerts (any size stock <= 5)
    const products = await Product.find({ isActive: { $ne: false } })
      .populate("brand", "name")
      .select("name sizes brand images");

    const lowStock = [];
    products.forEach((p) => {
      p.sizes?.forEach((s) => {
        if (s.stock <= 5) {
          lowStock.push({
            productId: p._id,
            name: p.name,
            brand: p.brand?.name,
            size: s.size,
            stock: s.stock,
            image: p.images?.[0],
          });
        }
      });
    });

    // Best Selling Products
    const bestSelling = await Order.aggregate([
      { $match: { orderStatus: { $nin: ["cancelled"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Monthly Sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $nin: ["cancelled", "refunded"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formattedMonthly = monthlySales.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      revenue: m.revenue,
      orders: m.orders,
    }));

    // Recent Orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(5)
      .select("total orderStatus paymentStatus createdAt user");

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStock,
        bestSelling,
        monthlySales: formattedMonthly,
        recentOrders,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};