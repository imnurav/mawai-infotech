import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import { getSlots } from "../api.js";
import SlotBookingModal from "../components/SlotBookingModal";
import Layout from "../components/Layout.jsx";
import { isSameDay } from "../utils/index.js";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [slotsByDate, setSlotsByDate] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalSlot, setModalSlot] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const fetchSlots = async (load = false) => {
    try {
      if (load) setLoading(true);
      const { data } = await getSlots();
      setSlotsByDate(data);

      const dates = data.map((entry) => new Date(entry.date));
      setAvailableDates(dates);

      const queryDate = searchParams.get("date");
      const initialDate = queryDate ? new Date(queryDate) : new Date();
      setSelectedDate(isNaN(initialDate) ? new Date() : initialDate);
    } catch {
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(true);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split("T")[0];
    setSearchParams({ date: dateString });
  };

  const getSlotsForSelectedDate = () => {
    const entry = slotsByDate.find((s) =>
      isSameDay(new Date(s.date), selectedDate)
    );
    return (entry?.slots || []).sort((a, b) => a.time.localeCompare(b.time));
  };

  const filteredSlots = getSlotsForSelectedDate();

  return (
    <Layout title="Book an Appointment">
      {/* Date selection section */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6 px-4">
        {/* Scrollable Date Buttons */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {availableDates.map((date) => {
            const isSelected = isSameDay(selectedDate, date);
            return (
              <button
                key={date.toDateString()}
                onClick={() => handleDateChange(date)}
                className={`cursor-pointer px-4 py-2 rounded-full border min-w-fit text-sm transition whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </button>
            );
          })}
        </div>

        {/* Custom Date Picker */}
        <div className="flex justify-center">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            filterDate={(date) =>
              availableDates.some((d) => isSameDay(d, date))
            }
            dateFormat="dd MMM yyyy"
            className="rounded-lg px-4 py-2 border shadow-sm text-center w-full max-w-xs"
            placeholderText="Select a date"
          />
        </div>
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => {
            const [hour, minute] = slot.time.split(":");
            const endTime = `${String(+hour + 1).padStart(2, "0")}:${minute}`;
            const timeLabel = `${slot.time} - ${endTime}`;

            let bgColor = "bg-green-100 hover:bg-green-200";
            if (slot.availableCount === 0)
              bgColor = "bg-red-100 hover:bg-red-200 !cursor-not-allowed";
            else if (!slot.available)
              bgColor = "bg-gray-200 cursor-not-allowed";
            else if (slot.availableCount < 3)
              bgColor = "bg-yellow-100 hover:bg-yellow-200";

            return (
              <button
                key={slot.time}
                disabled={!slot.available || slot.availableCount === 0}
                onClick={() =>
                  setModalSlot({
                    ...slot,
                    date: selectedDate.toISOString().split("T")[0],
                  })
                }
                className={`cursor-pointer p-4 rounded-lg shadow text-left transition ${bgColor}`}
              >
                <div className="font-semibold text-lg">{timeLabel}</div>
                <div className="text-sm text-gray-600">
                  {slot.reason || `${slot.availableCount} slots left`}
                </div>
              </button>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No available slots for this date.
          </p>
        )}
      </div>

      {/* Slot Booking Modal */}
      {modalSlot && (
        <SlotBookingModal
          slot={modalSlot}
          onClose={() => setModalSlot(null)}
          onBooked={() => {
            toast.success("Booked successfully!");
            setModalSlot(null);
            fetchSlots();
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}
