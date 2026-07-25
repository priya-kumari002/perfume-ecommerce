
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import api from "../api/axios";

export default function Checkout() {
  const { user } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    couponDiscount = 0,
    shipping = 0,
    tax = 0,
    total = 0,
    appliedCoupon = null,
  } = location.state || {};

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [sameBilling, setSameBilling] = useState(true);
  const [loading, setLoading] = useState(false);

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const discount = item.product?.discount || 0;
    const price = item.price - (item.price * discount) / 100;
    return sum + price * item.quantity;
  }, 0);

  const calcShipping = shipping || (subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0);
  const calcTax =
    tax || Math.round((subtotal - couponDiscount) * 0.18);
  const finalTotal =
    total ||
    Math.max(0, subtotal - couponDiscount + calcShipping + calcTax);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: form,
        billingAddress: sameBilling ? form : form,
        paymentMethod: "COD",
        couponCode: appliedCoupon?.code || "",
        couponDiscount,
        shippingCharge: calcShipping,
        tax: calcTax,
      });

      toast.success("Order placed successfully!");
      await fetchCart();
      navigate(`/order-success/${data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <Link to="/login" className="text-yellow-500 hover:underline">
          Please login to checkout
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-20">
        <p className="text-gray-400 mb-6">Your cart is empty</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-yellow-600 text-black rounded-full"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">
          Check<span className="text-yellow-500">out</span>
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          className="grid lg:grid-cols-3 gap-10"
        >
          {/* Left - Address */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    City *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    State *
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Pincode *
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={(e) => setSameBilling(e.target.checked)}
                />
                Billing address same as shipping
              </label>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked readOnly className="accent-yellow-500" />
                <span>Cash on Delivery (COD)</span>
              </label>
              <p className="text-xs text-gray-500 mt-2 ml-6">
                Pay when your order is delivered
              </p>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit sticky top-28">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between gap-2">
                  <span className="text-gray-400 truncate">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="flex-shrink-0">
                    ₹
                    {Math.round(
                      (item.price -
                        (item.price * (item.product?.discount || 0)) / 100) *
                        item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-gray-800 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>₹{Math.round(subtotal).toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>
                    Discount
                    {appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}
                  </span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className={calcShipping === 0 ? "text-green-500" : ""}>
                  {calcShipping === 0 ? "Free" : `₹${calcShipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax (GST 18%)</span>
                <span>₹{calcTax}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-700">
                <span>Total</span>
                <span className="text-yellow-500">
                  ₹{Math.round(finalTotal).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-yellow-600 text-black font-semibold rounded-full hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="block text-center text-sm text-gray-400 hover:text-yellow-500 mt-4"
            >
              ← Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}