// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../api/axios";

// export default function AdminCategories() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const { data } = await api.get("/categories");
//       setCategories(data.data || []);
//     } catch (error) {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const openModal = (cat = null) => {
//     if (cat) {
//       setEditing(cat);
//       setName(cat.name);
//       setDescription(cat.description || "");
//     } else {
//       setEditing(null);
//       setName("");
//       setDescription("");
//     }
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editing) {
//         // Update ke liye abhi basic rakh rahe hain (backend mein update route add karna hoga)
//         toast.success("Update feature coming");
//       } else {
//         await api.post("/categories", { name, description });
//         toast.success("Category created");
//       }
//       setShowModal(false);
//       fetchCategories();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this category?")) return;
//     toast.error("Delete route not added yet");
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Categories</h1>
//         <button
//           onClick={() => openModal()}
//           className="px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500"
//         >
//           + Add Category
//         </button>
//       </div>

//       <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-800 text-gray-400 text-sm">
//             <tr>
//               <th className="p-4">Name</th>
//               <th className="p-4">Slug</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((cat) => (
//               <tr key={cat._id} className="border-t border-gray-800">
//                 <td className="p-4">{cat.name}</td>
//                 <td className="p-4 text-gray-400">{cat.slug}</td>
//                 <td className="p-4">
//                   <button
//                     onClick={() => openModal(cat)}
//                     className="px-3 py-1 bg-blue-600 rounded text-sm mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(cat._id)}
//                     className="px-3 py-1 bg-red-600 rounded text-sm"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {editing ? "Edit Category" : "Add Category"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm mb-1">Name</label>
//                 <input
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm mb-1">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
//                 />
//               </div>
//               <div className="flex gap-3">
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

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (cat = null) => {
    if (cat) {
      setEditing(cat);
      setName(cat.name || "");
      setDescription(cat.description || "");
    } else {
      setEditing(null);
      setName("");
      setDescription("");
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, { name, description });
        toast.success("Category updated");
      } else {
        await api.post("/categories", { name, description });
        toast.success("Category created");
      }
      setShowModal(false);
      setEditing(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center">
        Loading categories...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500"
        >
          + Add Category
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-800">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-gray-400">{cat.slug}</td>
                  <td className="p-4 text-gray-400 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => openModal(cat)}
                      className="text-yellow-500 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No categories yet</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
            >
              <p className="font-medium text-lg">{cat.name}</p>
              <p className="text-sm text-gray-400 mt-1">Slug: {cat.slug}</p>
              {cat.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {cat.description}
                </p>
              )}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => openModal(cat)}
                  className="text-yellow-500 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
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
          <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg outline-none focus:border-yellow-500"
                />
              </div>
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