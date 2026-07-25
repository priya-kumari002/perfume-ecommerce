

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    try {
      const { data } = await api.get("/brands");
      setBrands(data.data || []);
    } catch (error) {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setShowModal(true);
  };

  const openEdit = (brand) => {
    setEditing(brand);
    setName(brand.name || "");
    setDescription(brand.description || "");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/brands/${editing._id}`, { name, description });
        toast.success("Brand updated");
      } else {
        await api.post("/brands", { name, description });
        toast.success("Brand created");
      }
      setShowModal(false);
      setEditing(null);
      setName("");
      setDescription("");
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      await api.delete(`/brands/${id}`);
      toast.success("Brand deleted");
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center">Loading brands...</div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Brands</h1>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500"
        >
          + Add Brand
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
            {brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No brands yet
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand._id} className="border-t border-gray-800">
                  <td className="p-4 font-medium">{brand.name}</td>
                  <td className="p-4 text-gray-400">{brand.slug}</td>
                  <td className="p-4 text-gray-400 max-w-xs truncate">
                    {brand.description || "—"}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => openEdit(brand)}
                      className="text-yellow-500 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand._id)}
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
        {brands.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No brands yet</p>
        ) : (
          brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
            >
              <p className="font-medium text-lg">{brand.name}</p>
              <p className="text-sm text-gray-400 mt-1">Slug: {brand.slug}</p>
              {brand.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {brand.description}
                </p>
              )}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => openEdit(brand)}
                  className="text-yellow-500 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="text-red-500 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Brand" : "Add Brand"}
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