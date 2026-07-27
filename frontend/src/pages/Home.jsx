
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
    <div className="min-h-screen overflow-x-hidden bg-pink-200 text- selection:bg-yellow-500 selection:text-black">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 grid items-center w-full gap-12 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:grid-cols-2">
          <div className="order-2 text-center lg:text-left lg:order-1">
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
              className="max-w-md mx-auto mb-8 text-base font-light text-slate-400 sm:text-lg lg:mx-0"
            >
              Experience the art of fine perfumery. Crafted with rare, hand-selected ingredients from around the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Link
                to="/products"
                className="px-8 py-4 font-bold transition-all duration-300 rounded-full shadow-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 hover:from-yellow-300 hover:to-yellow-500 shadow-yellow-500/20 hover:scale-105 active:scale-95"
              >
                Shop Collection
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-4 font-medium text-yellow-400 transition-all duration-300 border rounded-full border-yellow-500/40 hover:bg-yellow-500/10 hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-6 mt-12 text-xs font-medium lg:justify-start text-slate-400"
            >
              <span className="flex items-center gap-2">
                <span className="font-bold text-yellow-400">✓</span> Authentic Products
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-yellow-400">✓</span> Free Shipping ₹999+
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-yellow-400">✓</span> Secure Payment
              </span>
            </motion.div>
          </div>

          {/* 3D Floating Hero Image Card Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="relative flex justify-center order-1 lg:order-2 perspective-1000"
          >
            <div className="absolute inset-0 bg-yellow-500/20 blur-[90px] rounded-full scale-75" />
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-md p-4 overflow-hidden border shadow-2xl aspect-square rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-yellow-500/30 shadow-yellow-500/10 group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.15),transparent_50%)]" />
              
              {/* Hero Image with Object-Fit Support */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop"
                  alt="Luxury Perfume"
                  className="object-center w-full h-full transition-transform duration-700 object-fit group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <span className="mb-1 text-xs font-bold tracking-widest text-yellow-400 uppercase">Featured Edition</span>
                  <h3 className="text-xl font-bold text-white">LuxeScent Royal Elixir</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES CHIPS */}
      <section className="sticky top-0 z-40 border-y border-white/50 backdrop-blur-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-start gap-3 pb-1 overflow-x-auto scrollbar-none lg:justify-center">
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
              <p className="text-sm text-slate-500">Loading categories...</p>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            
            <Link
              to="/products?featured=true"
              className="items-center hidden gap-1 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300 sm:flex group"
            >
              View All <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-slate-900/60 rounded-3xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <div key={product._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-slate-500">No featured products found.</p>
          )}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-20 ">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Most Loved</p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              
              </h2>
            </div>
            <Link
              to="/products?bestSeller=true"
              className="items-center hidden gap-1 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300 sm:flex group"
            >
              View All <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>

          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <div key={product._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-slate-500">No best sellers found.</p>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
              className="items-center hidden gap-1 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300 sm:flex group"
            >
              View All <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <div key={product._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-slate-500">No new arrivals found.</p>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-24 overflow-hidden border-t border-white/5 bg-slate-900/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Testimonials</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              What Our <span className="text-yellow-400">Customers</span> Say
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
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
                className="p-8 transition-all duration-300 border shadow-xl bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 rounded-3xl hover:border-yellow-500/30"
              >
                <div className="flex gap-1 mb-4 text-base text-yellow-400">★★★★★</div>
                <p className="mb-8 text-sm font-light leading-relaxed text-slate-300">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 text-base font-bold text-yellow-400 border rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border-yellow-500/30">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
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
        <div className="max-w-3xl px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 overflow-hidden border shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-yellow-500/20 sm:p-12 rounded-3xl"
          >
            <div className="absolute w-40 h-40 rounded-full pointer-events-none -right-20 -top-20 bg-yellow-500/10 blur-3xl" />
            
            <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Newsletter</p>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Stay in the <span className="text-yellow-400">Loop</span>
            </h2>
            <p className="mb-8 text-sm font-light text-slate-400 sm:text-base">
              Subscribe for exclusive VIP offers, secret new drops & professional fragrance styling tips.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col max-w-md gap-3 mx-auto sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 text-sm text-white border rounded-full bg-slate-950 border-white/10 focus:outline-none focus:border-yellow-400 placeholder:text-slate-500"
              />
              <button className="px-8 py-4 font-bold transition-all rounded-full shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 hover:from-yellow-300 hover:to-yellow-500 shadow-yellow-500/20 active:scale-95">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-16 pb-10 bg-black border-t border-white/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 mb-12 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-4 text-2xl font-black tracking-wider text-yellow-400">
                LUXE<span className="text-white">SCENT</span>
              </h3>
              <p className="text-sm font-light leading-relaxed text-slate-500">
                Premium high-end fragrances curated for the modern connoisseur.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider text-white">Shop</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm">
                <li><Link to="/products" className="transition hover:text-yellow-400">All Products</Link></li>
                <li><Link to="/products?featured=true" className="transition hover:text-yellow-400">Featured</Link></li>
                <li><Link to="/products?bestSeller=true" className="transition hover:text-yellow-400">Best Sellers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider text-white">Support</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm">
                <li><Link to="/" className="transition hover:text-yellow-400">Contact Us-9931484733</Link></li>
                
                <li><Link to="/" className="transition hover:text-yellow-400">Banglore Karnatak</Link></li>
                <li><Link to="/" className="transition hover:text-yellow-400">call for querry-1800180020</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider text-white">Account</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm">
                <li><Link to="/login" className="transition hover:text-yellow-400">Login</Link></li>
                <li><Link to="/register" className="transition hover:text-yellow-400">Register</Link></li>
                <li><Link to="/orders" className="transition hover:text-yellow-400">Orders</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-xs text-center border-t border-white/5 text-slate-600 sm:text-sm">
            © 2026 LuxeScent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}