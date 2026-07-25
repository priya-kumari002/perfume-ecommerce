import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStock: [],
    bestSelling: [],
    monthlySales: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashRes = await api.get("/dashboard").catch(() => null);

        const [products, categories, brands] = await Promise.all([
          api.get("/products/admin/all"),
          api.get("/categories"),
          api.get("/brands"),
        ]);

        if (dashRes?.data?.data) {
          const d = dashRes.data.data;
          setStats({
            totalProducts: d.totalProducts || products.data.data?.length || 0,
            totalCategories: categories.data.data?.length || 0,
            totalBrands: brands.data.data?.length || 0,
            totalUsers: d.totalCustomers || 0,
            totalRevenue: d.totalRevenue || 0,
            totalOrders: d.totalOrders || 0,
            totalCustomers: d.totalCustomers || 0,
            lowStock: d.lowStock || [],
            bestSelling: d.bestSelling || [],
            monthlySales: d.monthlySales || [],
            recentOrders: d.recentOrders || [],
          });
        } else {
          setStats((prev) => ({
            ...prev,
            totalProducts: products.data.data?.length || 0,
            totalCategories: categories.data.data?.length || 0,
            totalBrands: brands.data.data?.length || 0,
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
    },
    { title: "Total Orders", value: stats.totalOrders || 0 },
    {
      title: "Total Customers",
      value: stats.totalCustomers || stats.totalUsers || 0,
    },
    { title: "Total Products", value: stats.totalProducts },
    { title: "Categories", value: stats.totalCategories },
    { title: "Brands", value: stats.totalBrands },
  ];

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center">Loading dashboard...</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6"
          >
            <p className="text-gray-400 text-sm mb-2">{card.title}</p>
            <p className="text-2xl sm:text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Monthly Sales</h2>
          {stats.monthlySales?.length > 0 ? (
            <div className="space-y-4">
              {stats.monthlySales.map((m) => {
                const maxRev = Math.max(
                  ...stats.monthlySales.map((x) => x.revenue),
                  1
                );
                const width = (m.revenue / maxRev) * 100;
                return (
                  <div key={m.month}>
                    <div className="flex justify-between text-sm mb-1 gap-2">
                      <span className="text-gray-400">{m.month}</span>
                      <span className="text-right">
                        ₹{m.revenue.toLocaleString()} · {m.orders} orders
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-600 rounded-full"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sales data yet</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">
            Best Selling Products
          </h2>
          {stats.bestSelling?.length > 0 ? (
            <div className="space-y-3">
              {stats.bestSelling.map((p, i) => (
                <div
                  key={p._id || i}
                  className="flex items-center justify-between bg-black/40 rounded-xl p-3 gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-yellow-500 font-bold text-sm shrink-0">
                      #{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.totalSold} sold</p>
                    </div>
                  </div>
                  <span className="text-yellow-500 text-sm font-medium shrink-0">
                    ₹{p.revenue?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sales yet</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Low Stock Alerts</h2>
            {stats.lowStock?.length > 0 && (
              <span className="bg-red-900 text-red-400 text-xs px-2.5 py-1 rounded-full">
                {stats.lowStock.length}
              </span>
            )}
          </div>
          {stats.lowStock?.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {stats.lowStock.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-red-900/10 border border-red-900/20 rounded-xl p-3"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.brand} · {item.size}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      item.stock === 0 ? "text-red-500" : "text-yellow-500"
                    }`}
                  >
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">All products well stocked ✓</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-yellow-500 text-sm hover:underline"
            >
              View All →
            </Link>
          </div>
          {stats.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between bg-black/40 rounded-xl p-3 gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {order.user?.name || "Customer"}
                    </p>
                    <p className="text-xs text-gray-500">
                      #{order._id?.slice(-6).toUpperCase()} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-yellow-500 font-medium">
                      ₹{order.total?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No orders yet</p>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Link
            to="/admin/products"
            className="px-4 sm:px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500 text-sm"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/categories"
            className="px-4 sm:px-5 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/brands"
            className="px-4 sm:px-5 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
          >
            Manage Brands
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 sm:px-5 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/coupons"
            className="px-4 sm:px-5 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
          >
            Manage Coupons
          </Link>
        </div>
      </div>
    </div>
  );
}