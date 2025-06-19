import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({ baseURL: import.meta.env.VITE_API });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      toast.error("Session expired. Please login again.");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const getSlots = (date) =>
  API.get("/bookings/slots", { params: { start: date } });
export const bookSlot = (data) => API.post("/bookings", data);

export const adminLogin = (credentials) =>
  API.post("/admin/login", credentials);
export const getAllBookings = () => API.get("/admin/bookings");
export const updateBooking = (id, data) =>
  API.put(`/admin/bookings/${id}`, data);
export const deleteBooking = (id) => API.delete(`/admin/bookings/${id}`);
export const createSlot = (data) => API.post("/admin/slots", data);
export const updateSlot = (id, data) => API.put(`/admin/slots/${id}`, data);
