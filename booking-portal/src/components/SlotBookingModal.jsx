import { useState } from "react";
import { toast } from "react-toastify";
import { bookSlot } from "../api";

export default function SlotBookingModal({ slot, onClose, onBooked }) {
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookSlot({
        ...form,
        date: slot.date,
        time: slot.time,
      });
      onBooked();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl px-6 py-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          X
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Book Appointment
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          You’re booking for{" "}
          <span className="font-medium text-gray-700">{slot.date}</span> at{" "}
          <span className="font-medium text-gray-700">{slot.time}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-blue-600  text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
