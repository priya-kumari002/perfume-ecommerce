// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../api/axios";

// export default function AdminCoupons() {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);

//   const [form, setForm] = useState({
//     code: "",
//     type: "percentage",
//     value: "",
//     minOrderAmount: 0,
//     maxDiscount: "",
//     expiryDate: "",
//     usageLimit: "",
//     isActive: true,
//   });

//   const fetchCoupons = async () => {
//     try {
//       const { data } = await api.get("/coupons");
//       setCoupons(data.data || []);
//     } catch (error) {
//       toast.error("Failed to load coupons");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const openModal = (coupon = null) => {
//     if (coupon) {
//       setEditing(coupon);
//       setForm({
//         code: coupon.code,
//         type: coupon.type,
//         value: coupon.value,
//         minOrderAmount: coupon.minOrderAmount || 0,
//         maxDiscount: coupon.maxDiscount || "",
//         expiryDate: coupon.expiryDate
//           ? new Date(coupon.expiryDate).toISOString().split("T")[0]
//           : "",
//         usageLimit: coupon.usageLimit || "",
//         isActive: coupon.isActive,
//       });
//     } else {
//       setEditing(null);
//       setForm({
//         code: "",
//         type: "percentage",
//         value: "",
//         minOrderAmount: 0,
//         maxDiscount: "",
//         expiryDate: "",
//         usageLimit: "",
//         isActive: true,
//       });
//     }
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...form,
//       value: Number(form.value),
//       minOrderAmount: Number(form.minOrderAmount) || 0,
//       maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
//       usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
//       expiryDate: form.expiryDate || undefined,
//     };

//     try {
//       if (editing) {
//         await api.put(`/coupons/${editing._id}`, payload);
//         toast.success("Coupon updated");
//       } else {
//         await api.post("/coupons", payload);
//         toast.success("Coupon created");
//       }
//       setShowModal(false);
//       fetchCoupons();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this coupon?")) return;
//     try {
//       await api.delete(`/coupons/${id}`);
//       toast.success("Coupon deleted");
//       fetchCoupons();
//     } catch (error) {
//       toast.error("Failed to delete");
//     }
//   };

//   if (loading) return <div className="text-white">Loading...</div>;

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Coupons</h1>
//         <button
//           onClick={() => openModal()}
//           className="px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500"
//         >
//           + Add Coupon
//         </button>
//       </div>

//       <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-800 text-gray-400 text-sm">
//             <tr>
//               <th className="p-4">Code</th>
//               <th className="p-4">Type</th>
//               <th className="p-4">Value</th>
//               <th className="p-4">Min Order</th>
//               <th className="p-4">Used</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {coupons.map((c) => (
//               <tr key={c._id} className="border-t border-gray-800">
//                 <td className="p-4 font-medium text-yellow-500">{c.code}</td>
//                 <td className="p-4 capitalize">{c.type}</td>
//                 <td className="p-4">
//                   {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
//                 </td>
//                 <td className="p-4">₹{c.minOrderAmount}</td>
//                 <td className="p-4">
//                   {c.usedCount || 0}
//                   {c.usageLimit ? ` / ${c.usageLimit}` : ""}
//                 </td>
//                 <td className="p-4">
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       c.isActive
//                         ? "bg-green-900 text-green-400"
//                         : "bg-red-900 text-red-400"
//                     }`}
//                   >
//                     {c.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <button
//                     onClick={() => openModal(c)}
//                     className="px-3 py-1 bg-blue-600 rounded text-sm mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     className="px-3 py-1 bg-red-600 rounded text-sm"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {coupons.length === 0 && (
//           <div className="p-10 text-center text-gray-500">No coupons yet</div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
//             <h2 className="text-xl font-bold mb-6">
//               {editing ? "Edit Coupon" : "Add Coupon"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm mb-1">Code *</label>
//                   <input
//                     value={form.code}
//                     onChange={(e) =>
//                       setForm({ ...form, code: e.target.value.toUpperCase() })
//                     }
//                     required
//                     className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1">Type *</label>
//                   <select
//                     value={form.type}
//                     onChange={(e) => setForm({ ...form, type: e.target.value })}
//                     className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                   >
//                     <option value="percentage">Percentage</option>
//                     <option value="flat">Flat</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm mb-1">
//                     Value * {form.type === "percentage" ? "(%)" : "(₹)"}
//                   </label>
//                   <input
//                     type="number"
//                     value={form.value}
//                     onChange={(e) => setForm({ ...form, value: e.target.value })}
//                     required
//                     min="1"
//                     className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1">Min Order Amount</label>
//                   <input
//                     type="number"
//                     value={form.minOrderAmount}
//                     onChange={(e) =>
//                       setForm({ ...form, minOrderAmount: e.target.value })
//                     }
//                     className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm mb-1">Max Discount (₹)</label>
//                   <input
//                     type="number"
//                     value={form.maxDiscount}
//                     onChange={(e) =>
//                       setForm({ ...form, maxDiscount: e.target.value })
//                     }
//                     className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1">Usage Limit</label>
//                   <input
//                     type="number"
//                     value={form.usageLimit}
//                     onChange={(e) =>
//                       setForm({ ...form, usageLimit: e.target.value })
//                     }
//                     className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Expiry Date</label>
//                 <input
//                   type="date"
//                   value={form.expiryDate}
//                   onChange={(e) =>
//                     setForm({ ...form, expiryDate: e.target.value })
//                   }
//                   className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
//                 />
//               </div>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.isActive}
//                   onChange={(e) =>
//                     setForm({ ...form, isActive: e.target.checked })
//                   }
//                 />
//                 Active
//               </label>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="submit"
//                   className="px-5 py-2 bg-yellow-600 text-black rounded-lg font-medium"
//                 >
//                   {editing ? "Update" : "Create"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-5 py-2 bg-gray-700 rounded-lg"
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
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderAmount: 0,
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.data || []);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditing(coupon);
      setForm({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount || 0,
        maxDiscount: coupon.maxDiscount || "",
        expiryDate: coupon.expiryDate
          ? new Date(coupon.expiryDate).toISOString().split("T")[0]
          : "",
        usageLimit: coupon.usageLimit || "",
        isActive: coupon.isActive,
      });
    } else {
      setEditing(null);
      setForm({
        code: "",
        type: "percentage",
        value: "",
        minOrderAmount: 0,
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      expiryDate: form.expiryDate || undefined,
    };

    try {
      if (editing) {
        await api.put(`/coupons/${editing._id}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created");
      }
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center">Loading coupons...</div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Coupons</h1>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500"
        >
          + Add Coupon
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-400 text-sm">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Used</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-t border-gray-800">
                  <td className="p-4 font-medium text-yellow-500">{c.code}</td>
                  <td className="p-4 capitalize">{c.type}</td>
                  <td className="p-4">
                    {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                  </td>
                  <td className="p-4">₹{c.minOrderAmount}</td>
                  <td className="p-4">
                    {c.usedCount || 0}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.isActive
                          ? "bg-green-900 text-green-400"
                          : "bg-red-900 text-red-400"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => openModal(c)}
                      className="text-yellow-500 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {coupons.length === 0 && (
          <div className="p-10 text-center text-gray-500">No coupons yet</div>
        )}
      </div>

      {/* Mobile / tablet cards */}
      <div className="lg:hidden space-y-3">
        {coupons.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No coupons yet</p>
        ) : (
          coupons.map((c) => (
            <div
              key={c._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-yellow-500 text-lg">
                    {c.code}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 capitalize">
                    {c.type} ·{" "}
                    {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs shrink-0 ${
                    c.isActive
                      ? "bg-green-900 text-green-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-400 space-y-1">
                <p>Min order: ₹{c.minOrderAmount}</p>
                <p>
                  Used: {c.usedCount || 0}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => openModal(c)}
                  className="text-yellow-500 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-red-500 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {editing ? "Edit Coupon" : "Add Coupon"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Code *
                  </label>
                  <input
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    required
                    className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Value * {form.type === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: e.target.value })
                    }
                    required
                    min="1"
                    className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Min Order Amount
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) =>
                      setForm({ ...form, minOrderAmount: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscount: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm({ ...form, usageLimit: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                Active
              </label>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}