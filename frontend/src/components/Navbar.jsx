import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/imageUrl";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // Close menu on route-sized screens when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-bold text-yellow-500 tracking-wider"
        >
          LUXE<span className="text-white">SCENT</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/products" className="text-gray-300 hover:text-yellow-500">
            Shop
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="text-yellow-500 font-medium">
                  Admin
                </Link>
              )}
              <Link to="/orders" className="text-gray-300 hover:text-yellow-500">
                Orders
              </Link>
              <Link
                to="/wishlist"
                className="text-gray-300 hover:text-yellow-500"
              >
                Wishlist
              </Link>

              <Link to="/cart" className="relative">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-600 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-90"
              >
                {user?.avatar ? (
                  <img
                    src={getImageUrl(user.avatar)}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-yellow-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-600/20 border border-yellow-600 flex items-center justify-center text-yellow-500 text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-gray-300 text-sm">
                  Hi, <span className="text-yellow-500">{user.name}</span>
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-yellow-500">
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-yellow-600 text-black font-medium rounded-full hover:bg-yellow-500"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <Link to="/cart" className="relative" onClick={closeMenu}>
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 text-white"
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-800 bg-black/95"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                to="/products"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-yellow-500"
              >
                Shop
              </Link>

              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-lg text-yellow-500 font-medium hover:bg-gray-900"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-yellow-500"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-yellow-500"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-yellow-500"
                  >
                    Cart {cartCount > 0 ? `(${cartCount})` : ""}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900"
                  >
                    {user?.avatar ? (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-yellow-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-yellow-600/20 border border-yellow-600 flex items-center justify-center text-yellow-500 text-sm font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span>
                      Profile ·{" "}
                      <span className="text-yellow-500">{user.name}</span>
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-yellow-500"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg bg-yellow-600 text-black font-medium text-center mt-2"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}