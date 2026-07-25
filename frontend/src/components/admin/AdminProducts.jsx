import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    shortDescription: "",
    discount: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    sizes: [{ size: "50ml", price: 0, stock: 0, sku: "" }],
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/admin/all");
      setProducts(data.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get("/categories"),
        api.get("/brands"),
      ]);
      setCategories(catRes.data.data || []);
      setBrands(brandRes.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", price: 0, stock: 0, sku: "" }],
    }));
  };

  const removeSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        brand: product.brand?._id || product.brand || "",
        category: product.category?._id || product.category || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        discount: product.discount || 0,
        isFeatured: product.isFeatured || false,
        isBestSeller: product.isBestSeller || false,
        isNewArrival: product.isNewArrival || false,
        sizes:
          product.sizes?.length > 0
            ? product.sizes
            : [{ size: "50ml", price: 0, stock: 0, sku: "" }],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        brand: "",
        category: "",
        description: "",
        shortDescription: "",
        discount: 0,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: false,
        sizes: [{ size: "50ml", price: 0, stock: 0, sku: "" }],
      });
    }
    setImageFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProduct && imageFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("shortDescription", formData.shortDescription || "");
    data.append("discount", Number(formData.discount));
    data.append("isFeatured", formData.isFeatured);
    data.append("isBestSeller", formData.isBestSeller);
    data.append("isNewArrival", formData.isNewArrival);
    data.append("sizes", JSON.stringify(formData.sizes));

    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", data);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      setImageFiles([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-yellow-600 text-black font-medium rounded-lg hover:bg-yellow-500"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-gray-800">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                   <img
  src={
    product.images?.[0]
      ? `http://localhost:5000${product.images[0].replace(/\\/g, "/")}`
      : "https://placehold.co/50x50?text=No+Image"
  }
  alt={product.name}
  className="w-12 h-12 object-cover rounded-lg"
  crossOrigin="anonymous"
  onError={(e) => {
    e.target.src = "https://placehold.co/50x50?text=No+Image";
  }}
/>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="p-4">{product.brand?.name || "-"}</td>
                <td className="p-4">
                  ₹{product.sizes?.[0]?.price?.toLocaleString() || 0}
                </td>
                <td className="p-4">
                  {product.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.isActive !== false
                        ? "bg-green-900 text-green-400"
                        : "bg-red-900 text-red-400"
                    }`}
                  >
                    {product.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No products found. Add your first product!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm mb-2">Product Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Product Images {editingProduct ? "(optional)" : "*"}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
                />
                {imageFiles.length > 0 && (
                  <p className="text-sm text-yellow-500 mt-2">
                    {imageFiles.length} image(s) selected
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm">Sizes / Variants *</label>
                  <button
                    type="button"
                    onClick={addSize}
                    className="text-sm text-yellow-500 hover:underline"
                  >
                    + Add Size
                  </button>
                </div>

                {formData.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 mb-3">
                    <input
                      placeholder="Size (50ml)"
                      value={size.size}
                      onChange={(e) =>
                        handleSizeChange(index, "size", e.target.value)
                      }
                      className="px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        handleSizeChange(index, "price", e.target.value)
                      }
                      className="px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        handleSizeChange(index, "stock", e.target.value)
                      }
                      className="px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="SKU"
                        value={size.sku}
                        onChange={(e) =>
                          handleSizeChange(index, "sku", e.target.value)
                        }
                        className="px-3 py-2 bg-black border border-gray-700 rounded-lg outline-none flex-1"
                        required
                      />
                      {formData.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="px-3 bg-red-600 rounded-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleChange}
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                  />
                  New Arrival
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-yellow-600 text-black font-medium rounded-lg hover:bg-yellow-500"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 bg-gray-700 rounded-lg hover:bg-gray-600"
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