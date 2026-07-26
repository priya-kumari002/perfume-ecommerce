
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
    <div className="min-h-screen bg-brown-300 text-white overflow-x-hidden selection:bg-yellow-500 selection:text-black">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-yellow-400 tracking-[0.35em] text-xs sm:text-sm mb-4 uppercase font-semibold"
            >
              Luxury Fragrance Collection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-sm">
                Signature Scent
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8 font-light"
            >
              Experience the art of fine perfumery. Crafted with rare, hand-selected ingredients from around the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 font-bold rounded-full hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95"
              >
                Shop Collection
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-4 border border-yellow-500/40 text-yellow-400 font-medium rounded-full hover:bg-yellow-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start text-xs text-slate-400 font-medium"
            >
              <span className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">✓</span> Authentic Products
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">✓</span> Free Shipping ₹999+
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">✓</span> Secure Payment
              </span>
            </motion.div>
          </div>

          {/* 3D Floating Hero Image Card Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="relative order-1 lg:order-2 flex justify-center perspective-1000"
          >
            <div className="absolute inset-0 bg-yellow-500/20 blur-[90px] rounded-full scale-75" />
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-yellow-500/30 p-4 shadow-2xl shadow-yellow-500/10 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.15),transparent_50%)]" />
              
              {/* Hero Image with Object-Fit Support */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop"
                  alt="Luxury Perfume"
                  className="w-full h-full object-fit  object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-1">Featured Edition</span>
                  <h3 className="text-xl font-bold text-white">LuxeScent Royal Elixir</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES CHIPS */}
      <section className="border-y border-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none items-center justify-start lg:justify-center">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  className="flex-shrink-0 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-sm font-medium text-slate-300 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <p className="text-slate-500 text-sm">Loading categories...</p>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className=" ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            
            <Link
              to="/products?featured=true"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition hidden sm:flex items-center gap-1 group"
            >
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-slate-900/60 rounded-3xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <div key={product._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">No featured products found.</p>
          )}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Most Loved</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              
              </h2>
            </div>
            <Link
              to="/products?bestSeller=true"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition hidden sm:flex items-center gap-1 group"
            >
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <div key={product._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">No best sellers found.</p>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Just Dropped</p>
              
            </div>
            <Link
              to="/products?newArrival=true"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition hidden sm:flex items-center gap-1 group"
            >
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <div key={product._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">No new arrivals found.</p>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden bg-slate-900/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              What Our <span className="text-yellow-400">Customers</span> Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav Sharma",
                text: "The quality is outstanding. The elite formulation has genuinely become my permanent signature scent.",
              },
              {
                name: "Priya Mehta",
                text: "Gorgeous bottle aesthetics, premium packaging, and incredibly long-lasting fragrance. Highly recommended!",
              },
              {
                name: "Rohan Kapoor",
                text: "The absolute best online fragrance store. Incredibly fast delivery and 100% authentic designer products.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 shadow-xl hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4 text-yellow-400 text-base">★★★★★</div>
                <p className="text-slate-300 mb-8 leading-relaxed text-sm font-light">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-base">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{item.name}</p>
                    <p className="text-xs text-yellow-500/80">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-yellow-500/20 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Newsletter</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              Stay in the <span className="text-yellow-400">Loop</span>
            </h2>
            <p className="text-slate-400 mb-8 text-sm sm:text-base font-light">
              Subscribe for exclusive VIP offers, secret new drops & professional fragrance styling tips.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 bg-slate-950 border border-white/10 rounded-full focus:outline-none focus:border-yellow-400 text-sm text-white placeholder:text-slate-500"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 font-bold rounded-full hover:from-yellow-300 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20 active:scale-95">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black pt-16 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl font-black text-yellow-400 tracking-wider mb-4">
                LUXE<span className="text-white">SCENT</span>
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Premium high-end fragrances curated for the modern connoisseur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm text-white tracking-wider">Shop</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm">
                <li><Link to="/products" className="hover:text-yellow-400 transition">All Products</Link></li>
                <li><Link to="/products?featured=true" className="hover:text-yellow-400 transition">Featured</Link></li>
                <li><Link to="/products?bestSeller=true" className="hover:text-yellow-400 transition">Best Sellers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm text-white tracking-wider">Support</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm">
                <li><Link to="/" className="hover:text-yellow-400 transition">Contact Us-9931484733</Link></li>
                
                <li><Link to="/" className="hover:text-yellow-400 transition">Banglore Karnatak</Link></li>
                <li><Link to="/" className="hover:text-yellow-400 transition">call for querry-1800180020</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm text-white tracking-wider">Account</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm">
                <li><Link to="/login" className="hover:text-yellow-400 transition">Login</Link></li>
                <li><Link to="/register" className="hover:text-yellow-400 transition">Register</Link></li>
                <li><Link to="/orders" className="hover:text-yellow-400 transition">Orders</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-slate-600 text-xs sm:text-sm">
            © 2026 LuxeScent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}