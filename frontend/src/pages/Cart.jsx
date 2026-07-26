
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

export default function Cart() {
  const { user } = useAuthStore();
  const { cart, loading, fetchCart, updateQuantity, removeItem } =
    useCartStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen  text-white flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl mb-4">Please login to view cart</h2>
        <Link
          to="/login"
          className="px-6 py-3 bg-yellow-600 text-black rounded-full"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const discount = item.product?.discount || 0;
    const price = item.price - (item.price * discount) / 100;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + shipping + tax);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    setApplying(true);
    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponCode,
        cartTotal: subtotal,
      });

      setCouponDiscount(data.data.discount);
      setAppliedCoupon(data.data);
      toast.success(`Coupon applied! Saved ₹${data.data.discount}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon");
      setCouponDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  return (
    <div className="min-h-screen bg-orange-200 text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">
          Shopping <span className="text-yellow-500">Cart</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="px-8 py-3 bg-yellow-600 text-black rounded-full font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const discount = item.product?.discount || 0;
                const finalPrice =
                  item.price - (item.price * discount) / 100;

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4"
                  >
                    <img
                      src={getImageUrl(item.product?.images?.[0])}
                      alt={item.product?.name}
                      className="w-24 h-24 object-fit rounded-xl"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?.slug}`}
                        className="font-medium hover:text-yellow-500"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        Size: {item.size}
                      </p>
                      <p className="text-yellow-500 font-semibold mt-1">
                        ₹{Math.round(finalPrice).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-800 rounded-lg"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-800 rounded-lg"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="ml-auto text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit space-y-5">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div>
                <p className="text-sm text-gray-400 mb-2">Coupon Code</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-900/30 border border-green-700 rounded-lg px-4 py-2">
                    <span className="text-green-400 text-sm">
                      {appliedCoupon.code} (-₹{couponDiscount})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={applying}
                      className="px-4 py-2 bg-yellow-600 text-black rounded-lg font-medium disabled:opacity-50"
                    >
                      {applying ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-800 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{Math.round(subtotal).toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shipping === 0 ? "text-green-500" : ""}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (GST 18%)</span>
                  <span>₹{tax}</span>
                </div>

                <div className="border-t border-gray-700 pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-yellow-500">
                    ₹{Math.round(total).toLocaleString()}
                  </span>
                </div>
              </div>

              {subtotal < 999 && subtotal > 0 && (
                <p className="text-xs text-gray-500">
                  Add ₹{Math.round(999 - subtotal)} more for free shipping
                </p>
              )}

              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      couponDiscount,
                      shipping,
                      tax,
                      total,
                      appliedCoupon,
                    },
                  })
                }
                className="w-full py-3.5 bg-yellow-600 text-black font-semibold rounded-full hover:bg-yellow-500 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-sm text-gray-400 hover:text-yellow-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}