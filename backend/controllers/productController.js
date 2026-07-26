import Product from "../models/Product.js";

// Get Products (Public)
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      featured,
      bestSeller,
      newArrival,
      sort = "-createdAt",
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (featured === "true") query.isFeatured = true;
    if (bestSeller === "true") query.isBestSeller = true;
    if (newArrival === "true") query.isNewArrival = true;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate("brand", "name logo")
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("brand", "name logo")
      .populate("category", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Product (Admin) — Cloudinary
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      shortDescription,
      discount,
      isFeatured,
      isBestSeller,
      isNewArrival,
      sizes,
    } = req.body;

    // Cloudinary: file.path / secure_url
    const images = req.files
      ? req.files.map((file) => file.path || file.secure_url)
      : [];

    const parsedSizes =
      typeof sizes === "string" ? JSON.parse(sizes) : sizes || [];

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      shortDescription: shortDescription || "",
      images,
      discount: Number(discount) || 0,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      sizes: parsedSizes,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Products for Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name")
      .populate("category", "name")
      .sort("-createdAt");
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product (Admin) — Cloudinary
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const updateData = { ...req.body };

    if (typeof updateData.sizes === "string") {
      updateData.sizes = JSON.parse(updateData.sizes);
    }

    if (updateData.discount !== undefined) {
      updateData.discount = Number(updateData.discount) || 0;
    }
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured =
        updateData.isFeatured === "true" || updateData.isFeatured === true;
    }
    if (updateData.isBestSeller !== undefined) {
      updateData.isBestSeller =
        updateData.isBestSeller === "true" || updateData.isBestSeller === true;
    }
    if (updateData.isNewArrival !== undefined) {
      updateData.isNewArrival =
        updateData.isNewArrival === "true" || updateData.isNewArrival === true;
    }

    // Nayi images Cloudinary se — purani + nayi
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => file.path || file.secure_url
      );
      updateData.images = [...(product.images || []), ...newImages];
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};