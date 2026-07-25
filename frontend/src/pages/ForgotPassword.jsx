
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Forgot Password
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your email to reset password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-600 text-black font-semibold rounded-xl hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {resetToken && (
          <div className="mt-6 p-4 bg-gray-800/80 border border-gray-700 rounded-xl">
            <p className="text-sm text-gray-300 mb-2">
              Reset Token (Development only):
            </p>
            <p className="text-yellow-500 text-xs break-all">{resetToken}</p>
            <Link
              to={`/reset-password/${resetToken}`}
              className="inline-block mt-3 text-sm text-yellow-500 hover:underline"
            >
              Click here to Reset Password →
            </Link>
          </div>
        )}

        <p className="text-center mt-6 text-gray-400">
          Remember password?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}