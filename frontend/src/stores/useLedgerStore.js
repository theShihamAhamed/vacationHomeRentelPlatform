// stores/useLedgerStore.js
import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useLedgerStore = create((set, get) => ({
  adminLedger: {
    escrowBalance: 0,
    totalCommission: 0,
  },
  ownerLedger: {
    totalEarnings: 0,
  },
  loading: false,
  error: null,

  // =====================
  // 🔹 Fetch Admin Ledger
  // =====================
  fetchAdminLedger: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/ledger/admin/dashboard");
      set({ adminLedger: res.data, loading: false });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  // =====================
  // 🔹 Fetch Owner Ledger
  // =====================
  fetchOwnerLedger: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/ledger/owner/dashboard");
      set({ ownerLedger: res.data, loading: false });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

}));
