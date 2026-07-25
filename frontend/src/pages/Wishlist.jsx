// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import useWishlistStore from "../store/wishlistStore";
// import useAuthStore from "../store/authStore";
// import ProductCard from "../components/ProductCard";

// export default function Wishlist() {
//   const { user } = useAuthStore();
//   const { wishlist, loading, fetchWishlist, removeFromWishlist } =
//     useWishlistStore();

//   useEffect(() => {
//     if (user) fetchWishlist();
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
//         <Link to="/login" className="text-yellow-500">Please login</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-6">
//         <h1 className="text-3xl font-bold mb-8">
//           My <span className="text-yellow-500">Wishlist</span>
//         </h1>

//         {loading ? (
//           <p className="text-gray-500">Loading...</p>
//         ) : wishlist.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-gray-400 mb-6">Wishlist is empty</p>
//             <Link
//               to="/products"
//               className="px-6 py-3 bg-yellow-600 text-black rounded-full"
//             >
//               Browse Products
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {wishlist.map((product) => (
//               <div key={product._id} className="relative">
//                 <ProductCard product={product} />
//                 <button
//                   onClick={() => removeFromWishlist(product._id)}
//                   className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-600 rounded-full text-sm"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useWishlistStore from "../store/wishlistStore";
import useAuthStore from "../store/authStore";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { user } = useAuthStore();
  const { wishlist, loading, fetchWishlist, removeFromWishlist } =
    useWishlistStore();

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-20">
        <p className="text-gray-400 mb-4">Please login to view wishlist</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-yellow-600 text-black rounded-full font-medium"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-yellow-500">Wishlist</span>
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center py-20">Loading...</p>
        ) : !wishlist || wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-6">Wishlist is empty</p>
            <Link
              to="/products"
              className="px-6 py-3 bg-yellow-600 text-black rounded-full font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full text-sm flex items-center justify-center transition"
                  title="Remove from wishlist"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}