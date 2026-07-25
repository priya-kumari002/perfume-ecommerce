import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

const statusColors = {
  pending: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
  processing: "bg-blue-900/50 text-blue-400 border-blue-700",
  shipped: "bg-purple-900/50 text-purple-400 border-purple-700",
  delivered: "bg-green-900/50 text-green-400 border-green-700",
  cancelled: "bg-red-900/50 text-red-400 border-red-700",
  refunded: "bg-gray-700/50 text-gray-300 border-gray-600",
  paid: "bg-green-900/50 text-green-400 border-green-700",
  failed: "bg-red-900/50 text-red-400 border-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders");
      setOrders(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (id, updates) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/status`, updates);
      toast.success("Order updated successfully");

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...data.data } : o))
      );

      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/80 text-gray-400">
              <tr>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="p-4">
                    <span className="font-mono text-yellow-500 text-xs">
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {order.items?.length || 0} item(s)
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="font-medium">{order.user?.name || "—"}</p>
                    <p className="text-gray-500 text-xs">{order.user?.email}</p>
                  </td>

                  <td className="p-4 font-semibold text-yellow-500">
                    ₹{order.total?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs border capitalize ${
                        statusColors[order.paymentStatus] || statusColors.pending
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                    <p className="text-gray-500 text-xs mt-1">
                      {order.paymentMethod}
                    </p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs border capitalize ${
                        statusColors[order.orderStatus] || statusColors.pending
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-yellow-600 text-black text-xs font-medium rounded-lg hover:bg-yellow-500 transition"
                    >
                      Manage
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-16 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    Order #{selectedOrder._id?.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xl transition"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Controls */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.orderStatus}
                      disabled={updating}
                      onChange={(e) =>
                        updateOrder(selectedOrder._id, {
                          orderStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 capitalize"
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.paymentStatus}
                      disabled={updating}
                      onChange={(e) =>
                        updateOrder(selectedOrder._id, {
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 capitalize"
                    >
                      {paymentStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer + Address */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-xl p-4">
                    <h3 className="text-sm text-gray-400 mb-2">Customer</h3>
                    <p className="font-medium">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-400">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4">
                    <h3 className="text-sm text-gray-400 mb-2">
                      Shipping Address
                    </h3>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedOrder.shippingAddress?.address}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state} -{" "}
                      {selectedOrder.shippingAddress?.pincode}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedOrder.shippingAddress?.phone}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-black/40 rounded-xl p-3"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-black/40 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  {selectedOrder.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>
                        Discount
                        {selectedOrder.couponCode
                          ? ` (${selectedOrder.couponCode})`
                          : ""}
                      </span>
                      <span>-₹{selectedOrder.couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>₹{selectedOrder.shippingCharge || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span>₹{selectedOrder.tax || 0}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span className="text-yellow-500">
                      ₹{selectedOrder.total?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`http://localhost:5000/api/orders/${selectedOrder._id}/invoice`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 border border-gray-700 rounded-xl text-sm hover:border-yellow-500 transition"
                  >
                    Download Invoice
                  </a>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-5 py-2.5 bg-gray-800 rounded-xl text-sm hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}