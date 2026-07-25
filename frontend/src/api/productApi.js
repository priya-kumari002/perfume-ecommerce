import api from "./axios";

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const getBrands = async () => {
  const { data } = await api.get("/brands");
  return data;
};