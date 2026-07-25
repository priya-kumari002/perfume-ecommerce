// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import api from "../api/axios";

// const getImageUrl = (img) => {
//   if (!img) return "https://placehold.co/80x80?text=No+Image";
//   if (img.startsWith("http")) return img;
//   const clean = img.replace(/\\/g, "/");
//   return `http://localhost:5000${clean.startsWith("/") ? clean : `/${clean}`}`;
// };

// export default function OrderDetails() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const { data } = await api.get(`/orders/${id}`);
//         setOrder(data.data);
//       } catch (error) {
//         toast.error("Order not found");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <Link to="/orders" className="text-yellow-500">Back to Orders</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-orange-200 text-white pt-24 pb-16">
//       <div className="max-w-4xl mx-auto px-6">
//         <Link to="/orders" className="text-yellow-500 text-sm mb-6 inline-block">
//           ← Back to Orders
//         </Link>

//         <h1 className="text-3xl font-bold mb-2">Order Details</h1>
//         <p className="text-gray-400 mb-8">ID: {order._id}</p>

//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//             <h2 className="font-semibold mb-4">Shipping Address</h2>
//             <p>{order.shippingAddress?.fullName}</p>
//             <p className="text-gray-400 text-sm">
//               {order.shippingAddress?.address}
//             </p>
//             <p className="text-gray-400 text-sm">
//               {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
//               {order.shippingAddress?.pincode}
//             </p>
//             <p className="text-gray-400 text-sm">
//               Phone: {order.shippingAddress?.phone}
//             </p>
//           </div>

//           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//             <h2 className="font-semibold mb-4">Order Info</h2>
//             <p>
//               Status:{" "}
//               <span className="text-yellow-500 capitalize">
//                 {order.orderStatus}
//               </span>
//             </p>
//             <p>
//               Payment:{" "}
//               <span className="capitalize">{order.paymentStatus}</span> (
//               {order.paymentMethod})
//             </p>
//             <p className="text-gray-400 text-sm mt-2">
//               {new Date(order.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* Items */}
//         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
//           <h2 className="font-semibold mb-4">Items</h2>
//           {order.items.map((item, i) => (
//             <div key={i} className="flex gap-4 items-center py-3 border-b border-gray-800 last:border-0">
//               <img
//                 src={getImageUrl(item.image)}
//                 alt={item.name}
//                 className="w-16 h-16 object-cover rounded-lg"
//               />
//               <div className="flex-1">
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-sm text-gray-400">
//                   Size: {item.size} × {item.quantity}
//                 </p>
//               </div>
//               <p>₹{(item.price * item.quantity).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>

//         {/* Totals */}
//         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-400">Subtotal</span>
//               <span>₹{order.subtotal?.toLocaleString()}</span>
//             </div>
//             {order.couponDiscount > 0 && (
//               <div className="flex justify-between text-green-400">
//                 <span>Discount</span>
//                 <span>-₹{order.couponDiscount}</span>
//               </div>
//             )}
//             <div className="flex justify-between">
//               <span className="text-gray-400">Shipping</span>
//               <span>₹{order.shippingCharge}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Tax</span>
//               <span>₹{order.tax}</span>
//             </div>
//             <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-700">
//               <span>Total</span>
//               <span className="text-yellow-500">
//                 ₹{order.total?.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        toast.error("Order not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Link to="/orders" className="text-yellow-500">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          to="/orders"
          className="text-yellow-500 text-sm mb-6 inline-block hover:underline"
        >
          ← Back to Orders
        </Link>

        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-gray-400 mb-8 font-mono text-sm">
          ID: #{order._id.slice(-8).toUpperCase()}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <p>{order.shippingAddress?.fullName}</p>
            <p className="text-gray-400 text-sm">
              {order.shippingAddress?.address}
            </p>
            <p className="text-gray-400 text-sm">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p className="text-gray-400 text-sm">
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Order Info</h2>
            <p>
              Status:{" "}
              <span className="text-yellow-500 capitalize">
                {order.orderStatus}
              </span>
            </p>
            <p>
              Payment:{" "}
              <span className="capitalize">{order.paymentStatus}</span> (
              {order.paymentMethod})
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Items</h2>
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 items-center py-3 border-b border-gray-800 last:border-0"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">
                  Size: {item.size} × {item.quantity}
                </p>
              </div>
              <p>₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-₹{order.couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <span>₹{order.shippingCharge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-700">
              <span>Total</span>
              <span className="text-yellow-500">
                ₹{order.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}