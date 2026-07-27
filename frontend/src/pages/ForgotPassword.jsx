
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setResetToken(data.resetToken || data.data?.resetToken || "");
      toast.success("Reset link generated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 border border-gray-700 shadow-2xl bg-gray-900/80 backdrop-blur-xl rounded-3xl"
      >
        <h2 className="mb-2 text-3xl font-bold text-center text-white">
          Forgot Password
        </h2>
        <p className="mb-8 text-center text-gray-400">
          Enter your email to reset password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-white transition border border-gray-600 bg-black/50 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-black transition bg-yellow-600 rounded-xl hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {resetToken && (
          <div className="p-4 mt-6 border border-gray-700 bg-gray-800/80 rounded-xl">
          
          
            <Link
              to={`/reset-password/${resetToken}`}
              className="inline-block mt-0 text-sm text-yellow-500 hover:underline"
            >
              Click here to Reset Password →
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-gray-400">
          Remember password?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}