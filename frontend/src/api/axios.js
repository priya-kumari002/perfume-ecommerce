import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // agar tum authStore se token save karte ho:
  if (!token) {
    try {
      const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
      if (auth?.state?.token) {
        config.headers.Authorization = `Bearer ${auth.state.token}`;
      }
    } catch {}
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;