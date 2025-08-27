import axiosInstance from "../lib/axios.js";
import { create } from "zustand";

export const useHomeStore = create((set) => ({
  homes: [],
  loading: false,
  error: null,

  createHome: async (homeData) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();

      const { images, ...rest } = homeData;
      formData.append("data", JSON.stringify(rest));

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axiosInstance.post("/home", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = res.data;

      set((state) => ({
        homes: [...state.homes, result.data],
        loading: false,
      }));

      return result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to create home";
      console.error("Zustand createHome error:", message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  getHomeById: async (id) => {
  set({ loading: true, error: null });

  try {
    const res = await axiosInstance.get(`/home/${id}`);
    set({ loading: false });
    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    set({ loading: false, error: message });
    throw new Error(message);
  }
},

fetchAllHomes: async () => {
  set({ loading: true, error: null });

  try {
    const res = await axiosInstance.get("/home"); // GET /api/home
    set({ homes: res.data.data, loading: false });
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    set({ loading: false, error: message });
    throw new Error(message);
  }
},
// ✅ Get homes by owner ID
  getHomesByOwner: async (ownerId) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get(`/home/owner/${ownerId}`);
      set({ homes: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✏️ Update home details
  updateHome: async (id, updatedData) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.put(`/home/${id}`, updatedData);
      const updatedHome = res.data.data;

      set((state) => ({
        homes: state.homes.map((home) => (home._id === id ? updatedHome : home)),
        loading: false,
      }));

      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🚫 Admin hides home due to violation
  hideHomeByAdmin: async (id, reason) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.put(`/home/admin/hide/${id}`, { reason });
      const updatedHome = res.data.data;

      set((state) => ({
        homes: state.homes.map((home) => (home._id === id ? updatedHome : home)),
        loading: false,
      }));

      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🕶️ Owner marks home as unavailable
  markHomeAsUnavailable: async (id, ownerId) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.put(`/home/owner/unavailable/${id}`, { ownerId });
      const updatedHome = res.data.data;

      set((state) => ({
        homes: state.homes.map((home) => (home._id === id ? updatedHome : home)),
        loading: false,
      }));

      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

}));


