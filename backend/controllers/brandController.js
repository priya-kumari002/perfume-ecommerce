import Brand from "../models/Brand.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort("name");
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};