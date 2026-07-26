import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-green-300 text-white flex flex-col items-center justify-center pt-24 pb-16 px-4">
      <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-3xl mb-6">
        ✓
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-400 mb-1 text-center text-sm">
        Order ID:{" "}
        <span className="text-yellow-500 font-mono">
          {id ? id.slice(-8).toUpperCase() : "—"}
        </span>
      </p>

      <p className="text-gray-500 mb-10 text-center text-sm">
        Thank you for shopping with LuxeScent
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          to="/orders"
          className="flex-1 text-center px-6 py-3 bg-yellow-600 text-black font-medium rounded-full hover:bg-yellow-500"
        >
          View Orders
        </Link>
        <Link
          to="/products"
          className="flex-1 text-center px-6 py-3 border border-gray-700 rounded-full hover:border-yellow-500"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}