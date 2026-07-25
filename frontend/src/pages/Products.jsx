
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories, getBrands } from "../api/productApi";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    featured: searchParams.get("featured") || "",
    bestSeller: searchParams.get("bestSeller") || "",
    newArrival: searchParams.get("newArrival") || "",
    sort: searchParams.get("sort") || "-createdAt",
    page: Number(searchParams.get("page")) || 1,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 12,
        sort: filters.sort,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.featured) params.featured = filters.featured;
      if (filters.bestSeller) params.bestSeller = filters.bestSeller;
      if (filters.newArrival) params.newArrival = filters.newArrival;

      const { data, pagination: pag } = await getProducts(params);
      setProducts(data || []);
      setPagination(pag || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    fetchProducts();

    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">
          All <span className="text-yellow-500">Products</span>
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search perfumes..."
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:border-yellow-500 outline-none"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.featured === "true"}
                  onChange={(e) =>
                    handleFilterChange(
                      "featured",
                      e.target.checked ? "true" : ""
                    )
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.bestSeller === "true"}
                  onChange={(e) =>
                    handleFilterChange(
                      "bestSeller",
                      e.target.checked ? "true" : ""
                    )
                  }
                />
                Best Sellers
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.newArrival === "true"}
                  onChange={(e) =>
                    handleFilterChange(
                      "newArrival",
                      e.target.checked ? "true" : ""
                    )
                  }
                />
                New Arrivals
              </label>
            </div>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  brand: "",
                  featured: "",
                  bestSeller: "",
                  newArrival: "",
                  sort: "-createdAt",
                  page: 1,
                })
              }
              className="w-full py-2.5 border border-gray-700 rounded-lg hover:border-yellow-500 transition text-sm"
            >
              Clear Filters
            </button>
          </aside>

          {/* GRID */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center text-gray-500 py-20">
                Loading products...
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button
                      disabled={pagination.page <= 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg disabled:opacity-40 hover:border-yellow-500"
                    >
                      Prev
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded-lg border ${
                          pagination.page === i + 1
                            ? "bg-yellow-600 text-black border-yellow-600"
                            : "bg-gray-900 border-gray-700 hover:border-yellow-500"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg disabled:opacity-40 hover:border-yellow-500"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-20">
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}