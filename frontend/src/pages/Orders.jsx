
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import api from "../api/axios";
// import useAuthStore from "../store/authStore";

// const getImageUrl = (img) => {
//   if (!img) return "https://placehold.co/80x80?text=No+Image";
//   if (img.startsWith("http")) return img;
//   const clean = img.replace(/\\/g, "/");
//   return `http://localhost:5000${clean.startsWith("/") ? clean : `/${clean}`}`;
// };

// const statusColor = {
//   pending: "bg-yellow-900 text-yellow-400",
//   processing: "bg-blue-900 text-blue-400",
//   shipped: "bg-purple-900 text-purple-400",
//   delivered: "bg-green-900 text-green-400",
//   cancelled: "bg-red-900 text-red-400",
//   refunded: "bg-gray-700 text-gray-300",
//   paid: "bg-blue-900 text-blue-400",
// };

// export default function Orders() {
//   const { user } = useAuthStore();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Review modal
//   const [reviewModal, setReviewModal] = useState(null); // { productId, name, image }
//   const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
//   const [submitting, setSubmitting] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await api.get("/orders/my-orders");
//       setOrders(data.data || []);
//     } catch (error) {
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchOrders();
//   }, [user]);

//   const handleCancel = async (orderId) => {
//     if (!window.confirm("Cancel this order?")) return;
//     try {
//       await api.put(`/orders/${orderId}/cancel`);
//       toast.success("Order cancelled");
//       fetchOrders();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Cannot cancel");
//     }
//   };

//   const openReview = (item) => {
//     setReviewModal({
//       productId: item.product?._id || item.product,
//       name: item.name,
//       image: item.image,
//       slug: item.slug,
//     });
//     setReviewForm({ rating: 5, comment: "" });
//   };

//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!reviewForm.comment.trim()) {
//       toast.error("Please write a comment");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await api.post(`/reviews/${reviewModal.productId}`, reviewForm);
//       toast.success("Review submitted!");
//       setReviewModal(null);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-orange-200 text-white flex items-center justify-center pt-20">
//         <Link to="/login" className="text-yellow-500">Please login</Link>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-orange-200 text-white pt-24 pb-16">
//       <div className="max-w-5xl mx-auto px-6">
//         <h1 className="text-3xl font-bold mb-8">
//           My <span className="text-yellow-500">Orders</span>
//         </h1>

//         {orders.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-gray-400 mb-6">No orders yet</p>
//             <Link
//               to="/products"
//               className="px-6 py-3 bg-yellow-600 text-black rounded-full"
//             >
//               Shop Now
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
//               >
//                 {/* Header */}
//                 <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//                   <div>
//                     <p className="text-sm text-gray-400">
//                       Order ID:{" "}
//                       <span className="text-white">{order._id}</span>
//                     </p>
//                     <p className="text-sm text-gray-400">
//                       {new Date(order.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
//                         statusColor[order.orderStatus] || "bg-gray-700"
//                       }`}
//                     >
//                       {order.orderStatus}
//                     </span>
//                     <span className="text-yellow-500 font-semibold">
//                       ₹{order.total?.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Items */}
//                 <div className="space-y-3 mb-4">
//                   {order.items.map((item, i) => (
//                     <div
//                       key={i}
//                       className="flex gap-3 items-center flex-wrap"
//                     >
//                       <img
//                         src={getImageUrl(item.image)}
//                         alt={item.name}
//                         className="w-14 h-14 object-cover rounded-lg"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium">{item.name}</p>
//                         <p className="text-sm text-gray-400">
//                           Size: {item.size} × {item.quantity}
//                         </p>
//                       </div>
//                       <p className="text-sm">
//                         ₹{(item.price * item.quantity).toLocaleString()}
//                       </p>

//                       {/* Review button - only for delivered */}
//                       {order.orderStatus === "delivered" && (
//                         <button
//                           onClick={() => openReview(item)}
//                           className="px-3 py-1.5 bg-yellow-600 text-black text-xs font-medium rounded-lg hover:bg-yellow-500"
//                         >
//                           ★ Rate & Review
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
//                   <Link
//                     to={`/orders/${order._id}`}
//                     className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-yellow-500"
//                   >
//                     View Details
//                   </Link>

//                   {["pending", "processing"].includes(order.orderStatus) && (
//                     <button
//                       onClick={() => handleCancel(order._id)}
//                       className="px-4 py-2 border border-red-700 text-red-500 rounded-lg text-sm hover:bg-red-900/30"
//                     >
//                       Cancel Order
//                     </button>
//                   )}

//                   <a
//                     href={`http://localhost:5000/api/orders/${order._id}/invoice`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-yellow-500"
//                   >
//                     Download Invoice
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Review Modal */}
//       {reviewModal && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <img
//                 src={getImageUrl(reviewModal.image)}
//                 alt=""
//                 className="w-14 h-14 rounded-lg object-cover"
//               />
//               <div>
//                 <p className="font-medium">{reviewModal.name}</p>
//                 <p className="text-sm text-gray-400">Rate this product</p>
//               </div>
//             </div>

//             <form onSubmit={submitReview}>
//               <div className="flex gap-2 mb-4 justify-center">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() =>
//                       setReviewForm({ ...reviewForm, rating: star })
//                     }
//                     className={`text-4xl transition ${
//                       star <= reviewForm.rating
//                         ? "text-yellow-500"
//                         : "text-gray-600"
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
//                 placeholder="Write your review..."
//                 rows={3}
//                 required
//                 className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 mb-4"
//               />

//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="flex-1 py-2.5 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 disabled:opacity-50"
//                 >
//                   {submitting ? "Submitting..." : "Submit Review"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setReviewModal(null)}
//                   className="px-5 py-2.5 bg-gray-700 rounded-xl"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { getImageUrl } from "../utils/imageUrl";

const statusColor = {
  pending: "bg-yellow-900 text-yellow-400",
  processing: "bg-blue-900 text-blue-400",
  shipped: "bg-purple-900 text-purple-400",
  delivered: "bg-green-900 text-green-400",
  cancelled: "bg-red-900 text-red-400",
  refunded: "bg-gray-700 text-gray-300",
  paid: "bg-blue-900 text-blue-400",
};

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data.data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot cancel");
    }
  };

  const openReview = (item) => {
    setReviewModal({
      productId: item.product?._id || item.product,
      name: item.name,
      image: item.image,
    });
    setReviewForm({ rating: 5, comment: "" });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/reviews/${reviewModal.productId}`, reviewForm);
      toast.success("Review submitted!");
      setReviewModal(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const invoiceUrl = (orderId) => {
    const base =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    return `${base}/orders/${orderId}/invoice`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <Link to="/login" className="text-yellow-500">
          Please login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-yellow-500">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-6">No orders yet</p>
            <Link
              to="/products"
              className="px-6 py-3 bg-yellow-600 text-black rounded-full"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Order ID:{" "}
                      <span className="text-white font-mono">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColor[order.orderStatus] || "bg-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-yellow-500 font-semibold">
                      ₹{order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center flex-wrap">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          Size: {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>

                      {order.orderStatus === "delivered" && (
                        <button
                          onClick={() => openReview(item)}
                          className="px-3 py-1.5 bg-yellow-600 text-black text-xs font-medium rounded-lg hover:bg-yellow-500"
                        >
                          ★ Rate & Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-yellow-500"
                  >
                    View Details
                  </Link>

                  {["pending", "processing"].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="px-4 py-2 border border-red-700 text-red-500 rounded-lg text-sm hover:bg-red-900/30"
                    >
                      Cancel Order
                    </button>
                  )}

                  <a
                    href={invoiceUrl(order._id)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-yellow-500"
                  >
                    Download Invoice
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={getImageUrl(reviewModal.image)}
                alt=""
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{reviewModal.name}</p>
                <p className="text-sm text-gray-400">Rate this product</p>
              </div>
            </div>

            <form onSubmit={submitReview}>
              <div className="flex gap-2 mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: star })
                    }
                    className={`text-4xl transition ${
                      star <= reviewForm.rating
                        ? "text-yellow-500"
                        : "text-gray-600"
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
                placeholder="Write your review..."
                rows={3}
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-5 py-2.5 bg-gray-700 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}