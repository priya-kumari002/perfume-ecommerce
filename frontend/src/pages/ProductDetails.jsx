
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getProductBySlug, getProducts } from "../api/productApi";
// import ProductCard from "../components/ProductCard";
// import useAuthStore from "../store/authStore";
// import useCartStore from "../store/cartStore";
// import useWishlistStore from "../store/wishlistStore";
// import api from "../api/axios";
// import { getImageUrl } from "../utils/imageUrl";

// export default function ProductDetails() {
//   const { slug } = useParams();
//   const { user } = useAuthStore();
//   const { addToCart } = useCartStore();
//   const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } =
//     useWishlistStore();

//   const [product, setProduct] = useState(null);
//   const [related, setRelated] = useState([]);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const [reviews, setReviews] = useState([]);
//   const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
//   const [submittingReview, setSubmittingReview] = useState(false);
//   const [canReview, setCanReview] = useState(false);

//   const [aiRecs, setAiRecs] = useState([]);
//   const [reviewSummary, setReviewSummary] = useState(null);

//   // 3D tilt
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;
//     setTilt({
//       x: (y - 0.5) * -18,
//       y: (x - 0.5) * 18,
//     });
//   };

//   const handleMouseLeave = () => {
//     setTilt({ x: 0, y: 0 });
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await getProductBySlug(slug);
//         setProduct(data);

//         if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);

//         if (data.category?._id) {
//           const relatedRes = await getProducts({
//             category: data.category._id,
//             limit: 4,
//           });
//           setRelated(
//             (relatedRes.data || []).filter((p) => p._id !== data._id)
//           );
//         }

//         if (data._id) {
//           const reviewRes = await api.get(`/reviews/${data._id}`);
//           setReviews(reviewRes.data.data || []);

//           api
//             .get(`/ai/recommendations?productId=${data._id}&limit=4`)
//             .then((res) => setAiRecs(res.data.data || []))
//             .catch(() => {});

//           api
//             .get(`/ai/reviews/summary/${data._id}`)
//             .then((res) => setReviewSummary(res.data.data))
//             .catch(() => {});
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Product not found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   useEffect(() => {
//     if (user && product?._id) {
//       api
//         .get("/orders/my-orders")
//         .then((res) => {
//           const orders = res.data.data || [];
//           const ordered = orders.some(
//             (o) =>
//               !["cancelled", "refunded"].includes(o.orderStatus) &&
//               o.items?.some(
//                 (item) =>
//                   item.product === product._id ||
//                   item.product?._id === product._id ||
//                   String(item.product) === String(product._id)
//               )
//           );
//           setCanReview(ordered);
//         })
//         .catch(() => setCanReview(false));
//     } else {
//       setCanReview(false);
//     }
//   }, [user, product?._id]);

//   useEffect(() => {
//     if (user) fetchWishlist();
//   }, [user]);

//   const handleAddToCart = async () => {
//     if (!user) return toast.error("Please login to add to cart");
//     if (!selectedSize) return toast.error("Please select a size");
//     await addToCart(product._id, selectedSize.size, qty);
//   };

//   const handleWishlist = async () => {
//     if (!user) return toast.error("Please login");
//     if (isInWishlist(product._id)) await removeFromWishlist(product._id);
//     else await addToWishlist(product._id);
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return toast.error("Please login to review");
//     if (!reviewForm.comment.trim())
//       return toast.error("Please write a comment");

//     setSubmittingReview(true);
//     try {
//       const { data } = await api.post(`/reviews/${product._id}`, reviewForm);
//       setReviews([data.data, ...reviews]);
//       setReviewForm({ rating: 5, comment: "" });
//       toast.success("Review submitted!");

//       const newCount = (product.ratings?.count || 0) + 1;
//       const newAvg =
//         ((product.ratings?.average || 0) * (product.ratings?.count || 0) +
//           reviewForm.rating) /
//         newCount;

//       setProduct((prev) => ({
//         ...prev,
//         ratings: { average: newAvg, count: newCount },
//       }));

//       api
//         .get(`/ai/reviews/summary/${product._id}`)
//         .then((res) => setReviewSummary(res.data.data))
//         .catch(() => {});
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmittingReview(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
//         <h1 className="text-4xl font-bold text-yellow-500 mb-4">404</h1>
//         <p className="text-gray-400 mb-6">Product not found</p>
//         <Link to="/products" className="text-yellow-500 hover:underline">
//           Back to Products
//         </Link>
//       </div>
//     );
//   }

//   const discountedPrice = selectedSize
//     ? selectedSize.price - (selectedSize.price * (product.discount || 0)) / 100
//     : 0;

//   return (
//     <div className="min-h-screen bg-orange-200 text-white pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Breadcrumb */}
//         <div className="text-sm text-gray-400 mb-8">
//           <Link to="/" className="hover:text-yellow-500">
//             Home
//           </Link>
//           {" / "}
//           <Link to="/products" className="hover:text-yellow-500">
//             Products
//           </Link>
//           {" / "}
//           <span className="text-white">{product.name}</span>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* ========== 3D IMAGE GALLERY ========== */}
//           <div>
//             <div
//               style={{ perspective: "1000px" }}
//               className="mb-4"
//               onMouseMove={handleMouseMove}
//               onMouseLeave={handleMouseLeave}
//             >
//               <div
//                 className="aspect-square bg-gray-900 rounded-2xl overflow-hidden relative transition-transform duration-200 ease-out"
//                 style={{
//                   transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
//                   transformStyle: "preserve-3d",
//                   boxShadow:
//                     tilt.x !== 0 || tilt.y !== 0
//                       ? `${-tilt.y * 1.5}px ${tilt.x * 1.5}px 40px rgba(234, 179, 8, 0.18)`
//                       : "0 25px 50px -12px rgba(0,0,0,0.5)",
//                 }}
//               >
//                 {/* Shine */}
//                 <div
//                   className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
//                   style={{
//                     background: `linear-gradient(
//                       ${135 + tilt.y * 2}deg,
//                       rgba(255,255,255,0.15) 0%,
//                       transparent 45%,
//                       transparent 100%
//                     )`,
//                     opacity: tilt.x !== 0 || tilt.y !== 0 ? 1 : 0,
//                   }}
//                 />

//                 <img
//                   src={getImageUrl(product.images?.[selectedImage])}
//                   alt={product.name}
//                   className="w-full h-full object-fit"
//                   style={{ transform: "translateZ(40px)" }}
//                   onError={(e) => {
//                     e.target.src =
//                       "https://placehold.co/600x600?text=No+Image";
//                   }}
//                 />
//               </div>
//             </div>

//             {product.images?.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto pb-1">
//                 {product.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setSelectedImage(i)}
//                     className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition hover:scale-105 ${
//                       selectedImage === i
//                         ? "border-yellow-500"
//                         : "border-gray-700"
//                     }`}
//                   >
//                     <img
//                       src={getImageUrl(img)}
//                       alt=""
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ========== PRODUCT INFO ========== */}
//           <div>
//             <p className="text-yellow-500 text-sm uppercase tracking-wider mb-2">
//               {product.brand?.name}
//             </p>
//             <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span
//                     key={star}
//                     className={
//                       star <= Math.round(product.ratings?.average || 0)
//                         ? "text-yellow-500"
//                         : "text-gray-600"
//                     }
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//               <span className="text-sm text-gray-400">
//                 {product.ratings?.average
//                   ? product.ratings.average.toFixed(1)
//                   : "0.0"}{" "}
//                 ({product.ratings?.count || 0} reviews)
//               </span>
//             </div>

//             <div className="flex items-center gap-3 mb-6">
//               <span className="text-3xl font-bold text-yellow-500">
//                 ₹{Math.round(discountedPrice).toLocaleString()}
//               </span>
//               {product.discount > 0 && selectedSize && (
//                 <>
//                   <span className="text-xl text-gray-500 line-through">
//                     ₹{selectedSize.price.toLocaleString()}
//                   </span>
//                   <span className="bg-yellow-600 text-black text-sm font-bold px-2 py-1 rounded">
//                     -{product.discount}%
//                   </span>
//                 </>
//               )}
//             </div>

//             <p className="text-gray-400 mb-8 leading-relaxed">
//               {product.description}
//             </p>

//             {/* Sizes */}
//             <div className="mb-6">
//               <p className="text-sm text-gray-400 mb-3">Select Size</p>
//               <div className="flex flex-wrap gap-3">
//                 {product.sizes?.map((size) => (
//                   <button
//                     key={size._id || size.size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`px-5 py-2.5 rounded-lg border transition ${
//                       selectedSize?.size === size.size
//                         ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
//                         : "border-gray-700 hover:border-gray-500"
//                     }`}
//                   >
//                     {size.size}
//                     {size.stock <= 0 && (
//                       <span className="text-red-500 text-xs ml-1">(Out)</span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity */}
//             <div className="mb-8">
//               <p className="text-sm text-gray-400 mb-3">Quantity</p>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setQty(Math.max(1, qty - 1))}
//                   className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
//                 >
//                   −
//                 </button>
//                 <span className="text-xl w-8 text-center">{qty}</span>
//                 <button
//                   onClick={() => setQty(qty + 1)}
//                   className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-wrap gap-4 mb-8">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={selectedSize?.stock <= 0}
//                 className="flex-1 py-3.5 bg-yellow-600 text-black font-semibold rounded-full hover:bg-yellow-500 transition disabled:opacity-50"
//               >
//                 Add to Cart
//               </button>

//               <button
//                 onClick={handleWishlist}
//                 className={`px-6 py-3.5 border rounded-full transition ${
//                   isInWishlist(product._id)
//                     ? "border-red-500 text-red-500"
//                     : "border-gray-700 hover:border-yellow-500"
//                 }`}
//               >
//                 {isInWishlist(product._id) ? "♥ Wishlisted" : "♡ Wishlist"}
//               </button>

//               <button
//                 onClick={() => {
//                   navigator.clipboard.writeText(window.location.href);
//                   toast.success("Link copied!");
//                 }}
//                 className="px-6 py-3.5 border border-gray-700 rounded-full hover:border-yellow-500 transition"
//               >
//                 Share
//               </button>
//             </div>

//             {/* Extra Info */}
//             <div className="border-t border-gray-800 pt-6 space-y-2 text-sm text-gray-400">
             
//               <p>
//                 <span className="text-white">Availability:</span>{" "}
//                 {selectedSize?.stock > 0 ? (
//                   <span className="text-green-500">
//                     In Stock ({selectedSize.stock})
//                   </span>
//                 ) : (
//                   <span className="text-red-500">Out of Stock</span>
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ========== REVIEWS ========== */}
//         <section className="mt-20 border-t border-gray-900 pt-12">
//           <h2 className="text-3xl font-bold mb-8">
//             Reviews & <span className="text-yellow-500">Ratings</span>
//           </h2>

//           <div className="flex items-center gap-6 mb-6">
//             <div className="text-center">
//               <p className="text-5xl font-bold text-yellow-500">
//                 {product.ratings?.average
//                   ? product.ratings.average.toFixed(1)
//                   : "0.0"}
//               </p>
//               <div className="flex gap-1 justify-center mt-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span
//                     key={star}
//                     className={
//                       star <= Math.round(product.ratings?.average || 0)
//                         ? "text-yellow-500"
//                         : "text-gray-600"
//                     }
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-400 mt-1">
//                 {product.ratings?.count || 0} reviews
//               </p>
//             </div>
//           </div>

//           {reviewSummary && reviewSummary.count > 0 && (
//             <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-xl p-4 mb-8 max-w-xl">
//               <p className="text-xs text-yellow-500 font-medium mb-1">
//                 🤖 AI Review Summary
//               </p>
//               <p className="text-sm text-gray-300">{reviewSummary.summary}</p>
//             </div>
//           )}

//           {user && canReview ? (
//             <form
//               onSubmit={handleReviewSubmit}
//               className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10 max-w-xl"
//             >
//               <h3 className="font-semibold mb-4">Write a Review</h3>
//               <div className="flex gap-2 mb-4">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() =>
//                       setReviewForm({ ...reviewForm, rating: star })
//                     }
//                     className={`text-3xl transition ${
//                       star <= reviewForm.rating
//                         ? "text-yellow-500"
//                         : "text-gray-600 hover:text-yellow-600"
//                     }`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
//               <textarea
//                 value={reviewForm.comment}
//                 onChange={(e) =>
//                   setReviewForm({ ...reviewForm, comment: e.target.value })
//                 }
//                 placeholder="Share your experience..."
//                 rows={3}
//                 required
//                 className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 mb-4"
//               />
//               <button
//                 type="submit"
//                 disabled={submittingReview}
//                 className="px-6 py-2.5 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 disabled:opacity-50"
//               >
//                 {submittingReview ? "Submitting..." : "Submit Review"}
//               </button>
//             </form>
//           ) : user && !canReview ? (
//             <p className="text-gray-400 mb-10">
//               Purchase this product to leave a review
//             </p>
//           ) : (
//             <p className="text-gray-400 mb-10">
//               <Link to="/login" className="text-yellow-500 hover:underline">
//                 Login
//               </Link>{" "}
//               to write a review
//             </p>
//           )}

//           <div className="space-y-4">
//             {reviews.length === 0 ? (
//               <p className="text-gray-500">No reviews yet. Be the first!</p>
//             ) : (
//               reviews.map((review) => (
//                 <div
//                   key={review._id}
//                   className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <img
//                       src={
//                         review.user?.avatar
//                           ? getImageUrl(review.user.avatar)
//                           : `https://ui-avatars.com/api/?name=${
//                               review.user?.name || "U"
//                             }&background=ca8a04&color=fff&size=40`
//                       }
//                       alt=""
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <div>
//                       <p className="font-medium">
//                         {review.user?.name || "User"}
//                       </p>
//                       <div className="flex gap-0.5">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <span
//                             key={star}
//                             className={
//                               star <= review.rating
//                                 ? "text-yellow-500 text-sm"
//                                 : "text-gray-600 text-sm"
//                             }
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <span className="ml-auto text-xs text-gray-500">
//                       {new Date(review.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <p className="text-gray-300 text-sm leading-relaxed">
//                     {review.comment}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>

//         {/* Related */}
//         {related.length > 0 && (
//           <section className="mt-20">
//             <h2 className="text-3xl font-bold mb-8">
//               Related <span className="text-yellow-500">Products</span>
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {related.map((p) => (
//                 <ProductCard key={p._id} product={p} />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* AI Recommended */}
//         {aiRecs.length > 0 && (
//           <section className="mt-20">
//             <h2 className="text-3xl font-bold mb-2">
//               AI <span className="text-yellow-500">Recommended</span> for You
//             </h2>
//             <p className="text-gray-500 text-sm mb-8">
//               Based on similarity, ratings & trends
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {aiRecs.map((p) => (
//                 <ProductCard key={p._id} product={p} />
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductBySlug, getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductDetails() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } =
    useWishlistStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);

  const [aiRecs, setAiRecs] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [zoomOpen, setZoomOpen] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -18, y: (x - 0.5) * 18 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductBySlug(slug);
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);

        if (data.category?._id) {
          const relatedRes = await getProducts({
            category: data.category._id,
            limit: 4,
          });
          setRelated(
            (relatedRes.data || []).filter((p) => p._id !== data._id)
          );
        }

        if (data._id) {
          const reviewRes = await api.get(`/reviews/${data._id}`);
          setReviews(reviewRes.data.data || []);

          api
            .get(`/ai/recommendations?productId=${data._id}&limit=4`)
            .then((res) => setAiRecs(res.data.data || []))
            .catch(() => {});

          api
            .get(`/ai/reviews/summary/${data._id}`)
            .then((res) => setReviewSummary(res.data.data))
            .catch(() => {});
        }
      } catch (error) {
        console.error(error);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (user && product?._id) {
      api
        .get("/orders/my-orders")
        .then((res) => {
          const orders = res.data.data || [];
          const ordered = orders.some(
            (o) =>
              !["cancelled", "refunded"].includes(o.orderStatus) &&
              o.items?.some(
                (item) =>
                  item.product === product._id ||
                  item.product?._id === product._id ||
                  String(item.product) === String(product._id)
              )
          );
          setCanReview(ordered);
        })
        .catch(() => setCanReview(false));
    } else {
      setCanReview(false);
    }
  }, [user, product?._id]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleAddToCart = async () => {
    if (!user) return toast.error("Please login to add to cart");
    if (!selectedSize) return toast.error("Please select a size");
    await addToCart(product._id, selectedSize.size, qty);
  };

  const handleWishlist = async () => {
    if (!user) return toast.error("Please login");
    if (isInWishlist(product._id)) await removeFromWishlist(product._id);
    else await addToWishlist(product._id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    if (!reviewForm.comment.trim())
      return toast.error("Please write a comment");

    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/reviews/${product._id}`, reviewForm);
      setReviews([data.data, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted!");

      const newCount = (product.ratings?.count || 0) + 1;
      const newAvg =
        ((product.ratings?.average || 0) * (product.ratings?.count || 0) +
          reviewForm.rating) /
        newCount;

      setProduct((prev) => ({
        ...prev,
        ratings: { average: newAvg, count: newCount },
      }));

      api
        .get(`/ai/reviews/summary/${product._id}`)
        .then((res) => setReviewSummary(res.data.data))
        .catch(() => {});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">404</h1>
        <p className="text-gray-400 mb-6">Product not found</p>
        <Link to="/products" className="text-yellow-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const discountedPrice = selectedSize
    ? selectedSize.price - (selectedSize.price * (product.discount || 0)) / 100
    : 0;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-yellow-500">Home</Link>
          {" / "}
          <Link to="/products" className="hover:text-yellow-500">Products</Link>
          {" / "}
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 3D GALLERY */}
          <div>
            <div
              style={{ perspective: "1000px" }}
              className="mb-4"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="aspect-square bg-gray-900 rounded-2xl overflow-hidden relative transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                  transformStyle: "preserve-3d",
                  boxShadow:
                    tilt.x !== 0 || tilt.y !== 0
                      ? `${-tilt.y * 1.5}px ${tilt.x * 1.5}px 40px rgba(234, 179, 8, 0.18)`
                      : "0 25px 50px -12px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(${135 + tilt.y * 2}deg, rgba(255,255,255,0.15) 0%, transparent 45%, transparent 100%)`,
                    opacity: tilt.x !== 0 || tilt.y !== 0 ? 1 : 0,
                  }}
                />
                <img
                  src={getImageUrl(product.images?.[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-fit cursor-zoom-in"
                  style={{ transform: "translateZ(40px)" }}
                  onClick={() => setZoomOpen(true)}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x600?text=No+Image";
                  }}
                />
              </div>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition hover:scale-105 ${
                      selectedImage === i ? "border-yellow-500" : "border-gray-700"
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-fit" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <p className="text-yellow-500 text-sm uppercase tracking-wider mb-2">
              {product.brand?.name}
            </p>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(product.ratings?.average || 0)
                        ? "text-yellow-500"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {product.ratings?.average
                  ? product.ratings.average.toFixed(1)
                  : "0.0"}{" "}
                ({product.ratings?.count || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-yellow-500">
                ₹{Math.round(discountedPrice).toLocaleString()}
              </span>
              {product.discount > 0 && selectedSize && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{selectedSize.price.toLocaleString()}
                  </span>
                  <span className="bg-yellow-600 text-black text-sm font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-400 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size._id || size.size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-lg border transition ${
                      selectedSize?.size === size.size
                        ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {size.size}
                    {size.stock <= 0 && (
                      <span className="text-red-500 text-xs ml-1">(Out)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
                >
                  −
                </button>
                <span className="text-xl w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={selectedSize?.stock <= 0}
                className="flex-1 py-3.5 bg-yellow-600 text-black font-semibold rounded-full hover:bg-yellow-500 transition disabled:opacity-50"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`px-6 py-3.5 border rounded-full transition ${
                  isInWishlist(product._id)
                    ? "border-red-500 text-red-500"
                    : "border-gray-700 hover:border-yellow-500"
                }`}
              >
                {isInWishlist(product._id) ? "♥ Wishlisted" : "♡ Wishlist"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="px-6 py-3.5 border border-gray-700 rounded-full hover:border-yellow-500 transition"
              >
                Share
              </button>
            </div>

            <div className="border-t border-gray-800 pt-6 space-y-2 text-sm text-gray-400">
              <p>
                <span className="text-white">SKU:</span>{" "}
                {selectedSize?.sku || "N/A"}
              </p>
              <p>
                <span className="text-white">Category:</span>{" "}
                {product.category?.name}
              </p>
              <p>
                <span className="text-white">Availability:</span>{" "}
                {selectedSize?.stock > 0 ? (
                  <span className="text-green-500">
                    In Stock ({selectedSize.stock})
                  </span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="mt-20 border-t border-gray-900 pt-12">
          <h2 className="text-3xl font-bold mb-8">
            Reviews & <span className="text-yellow-500">Ratings</span>
          </h2>

          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-yellow-500">
                {product.ratings?.average
                  ? product.ratings.average.toFixed(1)
                  : "0.0"}
              </p>
              <div className="flex gap-1 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(product.ratings?.average || 0)
                        ? "text-yellow-500"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {product.ratings?.count || 0} reviews
              </p>
            </div>
          </div>

          {reviewSummary && reviewSummary.count > 0 && (
            <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-xl p-4 mb-8 max-w-xl">
              <p className="text-xs text-yellow-500 font-medium mb-1">
                🤖 AI Review Summary
              </p>
              <p className="text-sm text-gray-300">{reviewSummary.summary}</p>
            </div>
          )}

          {user && canReview ? (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10 max-w-xl"
            >
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: star })
                    }
                    className={`text-3xl transition ${
                      star <= reviewForm.rating
                        ? "text-yellow-500"
                        : "text-gray-600 hover:text-yellow-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                placeholder="Share your experience..."
                rows={3}
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 mb-4"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : user && !canReview ? (
            <p className="text-gray-400 mb-10">
              Purchase this product to leave a review
            </p>
          ) : (
            <p className="text-gray-400 mb-10">
              <Link to="/login" className="text-yellow-500 hover:underline">
                Login
              </Link>{" "}
              to write a review
            </p>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={
                        review.user?.avatar
                          ? getImageUrl(review.user.avatar)
                          : `https://ui-avatars.com/api/?name=${
                              review.user?.name || "U"
                            }&background=ca8a04&color=fff&size=40`
                      }
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {review.user?.name || "User"}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= review.rating
                                ? "text-yellow-500 text-sm"
                                : "text-gray-600 text-sm"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold mb-8">
              Related <span className="text-yellow-500">Products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {aiRecs.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold mb-2">
              AI <span className="text-yellow-500">Recommended</span> for You
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Based on similarity, ratings & trends
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiRecs.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ========== ZOOM MODAL ========== */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition z-10"
          >
            ×
          </button>

          {product.images?.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(
                  (selectedImage - 1 + product.images.length) %
                    product.images.length
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition"
            >
              ‹
            </button>
          )}

          <img
            src={getImageUrl(product.images?.[selectedImage])}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {product.images?.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(
                  (selectedImage + 1) % product.images.length
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition"
            >
              ›
            </button>
          )}

          {product.images?.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === selectedImage ? "bg-yellow-500" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}