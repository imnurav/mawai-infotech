import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getAllBookings, updateBooking, deleteBooking } from "../api.js";
import EditBookingModal from "../components/EditBookingModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Layout from "../components/Layout.jsx";

export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (e) {
      toast.error(e.response.data.message || "❌ Failed to load bookings");
    }
  };

  const handleLogout = () => {
    setConfirmModal({
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      onConfirm: () => {
        localStorage.removeItem("adminToken");
        toast.success("👋 Logged out");
        navigate("/admin/login");
        setConfirmModal(null);
      },
    });
  };

  const handleDeleteBooking = (id) => {
    setConfirmModal({
      title: "Delete Booking",
      message: "Are you sure you want to delete this booking?",
      onConfirm: async () => {
        try {
          await deleteBooking(id);
          toast.success("🗑️ Booking deleted");
          fetchBookings();
        } catch {
          toast.error("❌ Failed to delete booking");
        }
        setConfirmModal(null);
      },
    });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          ({ name, phone }) =>
            name.toLowerCase().includes(term) ||
            phone.toLowerCase().includes(term)
        )
      );
    }
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const { date } = booking;
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {});

  const handleUpdateBooking = async (id, updatedData) => {
    try {
      await updateBooking(id, updatedData);
      toast.success("✅ Booking updated");
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "❌ Failed to update booking"
      );
    }
  };

  return (
    <Layout title="Admin Panel" subtitle="📅 Booking Management">
      {selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSave={handleUpdateBooking}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        {Object.keys(groupedBookings).length === 0 ? (
          <p className="text-gray-500 text-center">No bookings found.</p>
        ) : (
          Object.entries(groupedBookings)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, bookings]) => (
              <div key={date} className="mb-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  {formatDate(date)}
                </h3>
                <ul className="divide-y divide-gray-200 text-sm">
                  {bookings.map((b) => (
                    <li
                      key={b._id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {b.name}
                        </div>
                        <div className="text-gray-600">
                          📞 {b.phone} — 🕒 {b.time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Layout>
  );
}
