// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import useAuthStore from "../store/authStore";
// import PerfumeBottle3D from "../components/PerfumeBottle3D";
// import ProductCard from "../components/ProductCard";
// import { getProducts, getCategories } from "../api/productApi";

// export default function Home() {
//   const { user } = useAuthStore();
//   const [featured, setFeatured] = useState([]);
//   const [bestSellers, setBestSellers] = useState([]);
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [featuredRes, bestRes, newRes, catRes] = await Promise.all([
//           getProducts({ featured: true, limit: 4 }),
//           getProducts({ bestSeller: true, limit: 4 }),
//           getProducts({ newArrival: true, limit: 4 }),
//           getCategories(),
//         ]);

//         setFeatured(featuredRes.data || []);
//         setBestSellers(bestRes.data || []);
//         setNewArrivals(newRes.data || []);
//         setCategories(catRes.data || []);
//       } catch (error) {
//         console.error("Home fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
//       {/* HERO */}
//       <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />
//         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
//           <div className="text-center lg:text-left order-2 lg:order-1">
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-yellow-500/90 tracking-[0.35em] text-xs sm:text-sm mb-5 uppercase font-medium"
//             >
//               Luxury Fragrance Collection
//             </motion.p>

//             <motion.h1
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
//             >
//               Discover Your
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600">
//                 Signature Scent
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="text-gray-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-10"
//             >
//               Experience the art of fine perfumery. Crafted with rare ingredients
//               from around the world.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="flex flex-wrap gap-4 justify-center lg:justify-start"
//             >
//               <Link
//                 to="/products"
//                 className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition shadow-lg shadow-yellow-600/25"
//               >
//                 Shop Collection
//               </Link>
//               {!user && (
//                 <Link
//                   to="/register"
//                   className="px-8 py-3.5 border border-yellow-600/40 text-yellow-500 rounded-full hover:bg-yellow-600/10 transition"
//                 >
//                   Get Started
//                 </Link>
//               )}
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7 }}
//               className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start text-xs text-gray-500"
//             >
//               <span className="flex items-center gap-2">
//                 <span className="text-yellow-500">✓</span> Authentic Products
//               </span>
//               <span className="flex items-center gap-2">
//                 <span className="text-yellow-500">✓</span> Free Shipping ₹999+
//               </span>
//               <span className="flex items-center gap-2">
//                 <span className="text-yellow-500">✓</span> Secure Payment
//               </span>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.85 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1.2 }}
//             className="relative order-1 lg:order-2 flex justify-center"
//           >
//             <div className="absolute inset-0 bg-yellow-600/15 blur-[100px] rounded-full scale-75" />
//             <div className="relative w-full max-w-md aspect-square">
//               <PerfumeBottle3D />
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CATEGORIES */}
//       <section className="py-12 border-t border-white/5">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
//             {categories.length > 0 ? (
//               categories.map((cat) => (
//                 <Link
//                   key={cat._id}
//                   to={`/products?category=${cat._id}`}
//                   className="flex-shrink-0 px-6 py-2.5 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-500 transition whitespace-nowrap"
//                 >
//                   {cat.name}
//                 </Link>
//               ))
//             ) : (
//               <p className="text-gray-500 text-sm">No categories found</p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* FEATURED */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-end justify-between mb-10"
//           >
//             <div>
//               <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-2">
//                 Handpicked
//               </p>
//               <h2 className="text-3xl sm:text-4xl font-bold">
//                 Featured <span className="text-yellow-500">Products</span>
//               </h2>
//             </div>
//             <Link
//               to="/products?featured=true"
//               className="text-yellow-500 text-sm hover:underline hidden sm:block"
//             >
//               View All →
//             </Link>
//           </motion.div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="aspect-[3/4] bg-gray-900/50 rounded-2xl animate-pulse"
//                 />
//               ))}
//             </div>
//           ) : featured.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featured.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500 py-10">
//               No featured products yet
//             </p>
//           )}
//         </div>
//       </section>

//       {/* BEST SELLERS */}
//       <section className="py-16 bg-gradient-to-b from-gray-950/80 to-transparent">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-end justify-between mb-10"
//           >
//             <div>
//               <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-2">
//                 Most Loved
//               </p>
//               <h2 className="text-3xl sm:text-4xl font-bold">
//                 Best <span className="text-yellow-500">Sellers</span>
//               </h2>
//             </div>
//             <Link
//               to="/products?bestSeller=true"
//               className="text-yellow-500 text-sm hover:underline hidden sm:block"
//             >
//               View All →
//             </Link>
//           </motion.div>

//           {bestSellers.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {bestSellers.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500 py-10">No best sellers yet</p>
//           )}
//         </div>
//       </section>

//       {/* NEW ARRIVALS */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-end justify-between mb-10"
//           >
//             <div>
//               <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-2">
//                 Just Dropped
//               </p>
//               <h2 className="text-3xl sm:text-4xl font-bold">
//                 New <span className="text-yellow-500">Arrivals</span>
//               </h2>
//             </div>
//             <Link
//               to="/products?newArrival=true"
//               className="text-yellow-500 text-sm hover:underline hidden sm:block"
//             >
//               View All →
//             </Link>
//           </motion.div>

//           {newArrivals.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {newArrivals.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500 py-10">No new arrivals yet</p>
//           )}
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="py-20 border-t border-white/5 relative overflow-hidden">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-14"
//           >
//             <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-3">
//               Testimonials
//             </p>
//             <h2 className="text-3xl sm:text-4xl font-bold">
//               What Our <span className="text-yellow-500">Customers</span> Say
//             </h2>
//           </motion.div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               {
//                 name: "Aarav Sharma",
//                 text: "The quality is outstanding. Sauvage Elixir has become my signature scent.",
//               },
//               {
//                 name: "Priya Mehta",
//                 text: "Beautiful packaging and long-lasting fragrance. Highly recommended!",
//               },
//               {
//                 name: "Rohan Kapoor",
//                 text: "Best online perfume store. Fast delivery and genuine products.",
//               },
//             ].map((item, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.12 }}
//                 className="bg-gradient-to-br from-gray-900/80 to-gray-950 border border-white/5 rounded-2xl p-6 sm:p-8"
//               >
//                 <div className="flex gap-1 mb-4 text-yellow-500 text-sm">
//                   ★★★★★
//                 </div>
//                 <p className="text-gray-300 mb-6 leading-relaxed text-sm">
//                   "{item.text}"
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-500 font-bold text-sm">
//                     {item.name[0]}
//                   </div>
//                   <div>
//                     <p className="font-medium text-sm">{item.name}</p>
//                     <p className="text-xs text-gray-500">Verified Buyer</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* NEWSLETTER */}
//       <section className="py-20">
//         <div className="max-w-3xl mx-auto px-4 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-3">
//               Newsletter
//             </p>
//             <h2 className="text-3xl sm:text-4xl font-bold mb-4">
//               Stay in the <span className="text-yellow-500">Loop</span>
//             </h2>
//             <p className="text-gray-400 mb-8 text-sm sm:text-base">
//               Subscribe for exclusive offers, new arrivals & fragrance tips.
//             </p>
//             <form
//               onSubmit={(e) => e.preventDefault()}
//               className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
//             >
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-5 py-3.5 bg-gray-900 border border-white/10 rounded-full focus:outline-none focus:border-yellow-500 text-sm"
//               />
//               <button className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition">
//                 Subscribe
//               </button>
//             </form>
//           </motion.div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="border-t border-white/5 pt-14 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
//             <div className="col-span-2 md:col-span-1">
//               <h3 className="text-2xl font-bold text-yellow-500 mb-4">
//                 LUXE<span className="text-white">SCENT</span>
//               </h3>
//               <p className="text-gray-500 text-sm leading-relaxed">
//                 Premium fragrances for the modern connoisseur.
//               </p>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-sm">Shop</h4>
//               <ul className="space-y-2.5 text-gray-500 text-sm">
//                 <li>
//                   <Link to="/products" className="hover:text-yellow-500 transition">
//                     All Products
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/products?featured=true"
//                     className="hover:text-yellow-500 transition"
//                   >
//                     Featured
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/products?bestSeller=true"
//                     className="hover:text-yellow-500 transition"
//                   >
//                     Best Sellers
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-sm">Support</h4>
//               <ul className="space-y-2.5 text-gray-500 text-sm">
//                 <li>
//                   <Link to="/" className="hover:text-yellow-500 transition">
//                     Contact Us
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/" className="hover:text-yellow-500 transition">
//                     Shipping Info
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/" className="hover:text-yellow-500 transition">
//                     Returns
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-sm">Account</h4>
//               <ul className="space-y-2.5 text-gray-500 text-sm">
//                 <li>
//                   <Link to="/login" className="hover:text-yellow-500 transition">
//                     Login
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/register" className="hover:text-yellow-500 transition">
//                     Register
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/orders" className="hover:text-yellow-500 transition">
//                     Orders
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-xs sm:text-sm">
//             © 2026 LuxeScent. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../api/productApi";

export default function Home() {
  const { user } = useAuthStore();
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes, newRes, catRes] = await Promise.all([
          getProducts({ featured: true, limit: 4 }),
          getProducts({ bestSeller: true, limit: 4 }),
          getProducts({ newArrival: true, limit: 4 }),
          getCategories(),
        ]);

        setFeatured(featuredRes.data || []);
        setBestSellers(bestRes.data || []);
        setNewArrivals(newRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-yellow-500/90 tracking-[0.35em] text-xs sm:text-sm mb-5 uppercase font-medium"
            >
              Luxury Fragrance Collection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
            >
              Discover Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600">
                Signature Scent
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-10"
            >
              Experience the art of fine perfumery. Crafted with rare ingredients
              from around the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition shadow-lg shadow-yellow-600/25"
              >
                Shop Collection
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-3.5 border border-yellow-600/40 text-yellow-500 rounded-full hover:bg-yellow-600/10 transition"
                >
                  Get Started
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start text-xs text-gray-500"
            >
              <span className="flex items-center gap-2">
                <span className="text-yellow-500">✓</span> Authentic Products
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-500">✓</span> Free Shipping ₹999+
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-500">✓</span> Secure Payment
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            <div className="absolute inset-0 bg-yellow-600/15 blur-[100px] rounded-full scale-75" />
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-yellow-600/20 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-7xl mb-4">🧴</div>
                <p className="text-yellow-500 font-semibold text-lg tracking-wider">
                  LUXESCENT
                </p>
                <p className="text-gray-500 text-sm mt-2">Premium Fragrance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  className="flex-shrink-0 px-6 py-2.5 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-500 transition whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No categories found</p>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-2">
                Handpicked
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Featured <span className="text-yellow-500">Products</span>
              </h2>
            </div>
            <Link
              to="/products?featured=true"
              className="text-yellow-500 text-sm hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gray-900/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">
              No featured products yet
            </p>
          )}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-16 bg-gradient-to-b from-gray-950/80 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-2">
                Most Loved
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Best <span className="text-yellow-500">Sellers</span>
              </h2>
            </div>
            <Link
              to="/products?bestSeller=true"
              className="text-yellow-500 text-sm hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </motion.div>

          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No best sellers yet</p>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-2">
                Just Dropped
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">
                New <span className="text-yellow-500">Arrivals</span>
              </h2>
            </div>
            <Link
              to="/products?newArrival=true"
              className="text-yellow-500 text-sm hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </motion.div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No new arrivals yet</p>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              What Our <span className="text-yellow-500">Customers</span> Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Aarav Sharma",
                text: "The quality is outstanding. Sauvage Elixir has become my signature scent.",
              },
              {
                name: "Priya Mehta",
                text: "Beautiful packaging and long-lasting fragrance. Highly recommended!",
              },
              {
                name: "Rohan Kapoor",
                text: "Best online perfume store. Fast delivery and genuine products.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-950 border border-white/5 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex gap-1 mb-4 text-yellow-500 text-sm">★★★★★</div>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-500 font-bold text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-3">
              Newsletter
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stay in the <span className="text-yellow-500">Loop</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">
              Subscribe for exclusive offers, new arrivals & fragrance tips.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 bg-gray-900 border border-white/10 rounded-full focus:outline-none focus:border-yellow-500 text-sm"
              />
              <button className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                LUXE<span className="text-white">SCENT</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Premium fragrances for the modern connoisseur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Shop</h4>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>
                  <Link to="/products" className="hover:text-yellow-500 transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?featured=true"
                    className="hover:text-yellow-500 transition"
                  >
                    Featured
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?bestSeller=true"
                    className="hover:text-yellow-500 transition"
                  >
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>
                  <Link to="/" className="hover:text-yellow-500 transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-yellow-500 transition">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-yellow-500 transition">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Account</h4>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>
                  <Link to="/login" className="hover:text-yellow-500 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-yellow-500 transition">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-yellow-500 transition">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-xs sm:text-sm">
            © 2026 LuxeScent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}