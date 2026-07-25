// import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-20 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-4xl text-green-500 mb-6"
      >
        ✓
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-2 text-center"
      >
        Order Placed Successfully!
      </motion.h1>

      <p className="text-gray-400 mb-1 text-sm">
        Order ID:{" "}
        <span className="text-yellow-500 font-mono">
          {id?.slice(-8).toUpperCase() || id}
        </span>
      </p>
      <p className="text-gray-500 mb-10 text-center">
        Thank you for shopping with LuxeScent
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/orders"
          className="px-6 py-3 bg-yellow-600 text-black rounded-full font-medium hover:bg-yellow-500 transition"
        >
          View Orders
        </Link>
        <Link
          to={`/orders/${id}`}
          className="px-6 py-3 border border-gray-700 rounded-full hover:border-yellow-500 transition"
        >
          Order Details
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 border border-gray-700 rounded-full hover:border-yellow-500 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}