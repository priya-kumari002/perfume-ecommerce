
import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get("/cart");
      set({ cart: data.data || data, loading: false });
    } catch (error) {
      set({ loading: false });
      // 401 = not logged in — silent
      if (error.response?.status !== 401) {
        console.error("fetchCart:", error.response?.data || error.message);
      }
    }
  },

  addToCart: async (productId, size, quantity = 1) => {
    try {
      const { data } = await api.post("/cart/add", {
        productId,
        size,
        quantity,
      });
      set({ cart: data.data || data });
      toast.success("Added to cart");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
      return false;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) {
      return get().removeItem(itemId);
    }
    try {
      const { data } = await api.put("/cart/update", { itemId, quantity });
      set({ cart: data.data || data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${itemId}`);
      set({ cart: data.data || data });
      toast.success("Removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove");
    }
  },

  clearCart: () => set({ cart: null }),
}));

export default useCartStore;