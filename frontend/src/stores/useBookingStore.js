// stores/useBookingStore.js
import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useBookingStore = create((set, get) => ({
  bookings: [],
  loading: false,
  error: null,

  // ✅ Fetch all bookings
  fetchAllBookings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/booking");
      set({ bookings: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Fetch bookings for a specific home
  fetchBookingsByHomeId: async (homeId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/booking/home/${homeId}`);
      set({ bookings: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Fetch bookings for a specific owner
  fetchBookingsByOwnerId: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/booking/owner/${ownerId}`);
      set({ bookings: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  // ✅ Complete a booking
  completeBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post(`/booking/complete/${bookingId}`);

      if (data.success) {
        // Remove completed booking from state
        set((state) => ({
          bookings: state.bookings.filter((b) => b._id !== bookingId),
          loading: false,
        }));
        toast.success("Booking marked as completed!");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Try again.";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  // ✅ Create new booking
  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/booking", bookingData);
      const result = res.data;

      set((state) => ({
        bookings: [...state.bookings, result.data],
        loading: false,
      }));

      toast.success("Booking created successfully!");
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to create booking";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  // ✅ Get booking by ID
  getBookingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/booking/${id}`);
      set({ loading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },
}));
