import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,

  fetchWishlist: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get("/wishlist");
      set({ wishlist: data.data?.products || [] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      const { data } = await api.post("/wishlist/add", { productId });
      set({ wishlist: data.data?.products || [] });
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const { data } = await api.delete(`/wishlist/remove/${productId}`);
      set({ wishlist: data.data?.products || [] });
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed");
    }
  },

  isInWishlist: (productId) => {
    return get().wishlist.some(
      (p) => p._id === productId || p === productId
    );
  },
}));

export default useWishlistStore;