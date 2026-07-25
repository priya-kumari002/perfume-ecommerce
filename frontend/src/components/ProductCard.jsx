 import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductCard({ product }) {
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  const mainSize = product.sizes?.[0];
  const discountedPrice = mainSize
    ? mainSize.price - (mainSize.price * (product.discount || 0)) / 100
    : 0;

  const imageUrl = getImageUrl(product.images?.[0]);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    if (!mainSize) {
      toast.error("No size available");
      return;
    }

    await addToCart(product._id, mainSize.size, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden group relative"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-800">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x400?text=No+Image";
            }}
          />
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-yellow-600 text-black text-xs font-bold px-2.5 py-1 rounded">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-yellow-500 mb-1 uppercase tracking-wider">
            {product.brand?.name || "Brand"}
          </p>
          <h3 className="font-medium text-white truncate text-lg">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-yellow-500 font-semibold text-lg">
              ₹{Math.round(discountedPrice).toLocaleString()}
            </span>
            {product.discount > 0 && mainSize && (
              <span className="text-gray-500 text-sm line-through">
                ₹{mainSize.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={handleQuickAdd}
        className="absolute bottom-4 right-4 w-10 h-10 bg-yellow-600 text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-yellow-500 shadow-lg"
        title="Add to Cart"
      >
        +
      </button>
    </motion.div>
  );
}