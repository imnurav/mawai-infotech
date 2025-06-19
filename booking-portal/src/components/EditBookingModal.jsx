import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function EditBookingModal({ booking, onClose, onSave }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setSelectedDate(new Date(booking.date));
    setSelectedTime(booking.time);
    setPhone(booking.phone || "");
  }, [booking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(booking._id, {
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      phone,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="cursor-pointer">
            <label className="block text-sm font-medium mb-1">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 6))}
              filterDate={(date) => date.getDay() !== 0}
              dateFormat="dd MMM yyyy"
              className="border rounded-lg p-2 w-full shadow-sm"
              placeholderText="Select a date"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              className="border  rounded-lg px-4 py-2 w-full"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min="09:00"
              max="18:00"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="border rounded-lg px-4 py-2 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
