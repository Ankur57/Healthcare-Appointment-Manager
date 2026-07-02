import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  getSlots,
  bookAppointment,
} from "../../services/doctor.service";

function BookAppointmentModal({
  doctorId,
  open,
  setOpen,
}) {
  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [slots, setSlots] =
    useState([]);

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [symptoms, setSymptoms] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (appointmentDate) {
      loadSlots();
    }
  }, [appointmentDate]);

  const loadSlots =
    async () => {
      try {
        const data =
          await getSlots(
            doctorId,
            appointmentDate
          );

        setSlots(data);
      } catch (error) {
        toast.error(
          "Failed to load slots"
        );
      }
    };

  const handleBook =
    async () => {
      if (!appointmentDate) {
        return toast.error(
          "Select a date"
        );
      }

      if (!selectedSlot) {
        return toast.error(
          "Select a slot"
        );
      }

      try {
        setLoading(true);

        await bookAppointment({
          doctorId,
          appointmentDate,
          startTime:
            selectedSlot,
          symptoms,
        });

        toast.success(
          "Appointment booked successfully"
        );

        setOpen(false);
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Booking failed"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl p-8 w-[700px]">

        <h2 className="text-3xl font-bold mb-6">
          Book Appointment
        </h2>

        <div className="space-y-6">

          <input
            type="date"
            className="w-full border p-4 rounded-xl"
            value={appointmentDate}
            onChange={(e) =>
              setAppointmentDate(
                e.target.value
              )
            }
          />

          <div>

            <h3 className="font-semibold mb-3">
              Available Slots
            </h3>

            <div className="grid grid-cols-3 gap-3">

              {slots.map(
                (slot) => (
                  <button
                    key={slot}
                    onClick={() =>
                      setSelectedSlot(
                        slot
                      )
                    }
                    className={`p-3 rounded-xl border ${
                      selectedSlot ===
                      slot
                        ? "bg-blue-600 text-white"
                        : ""
                    }`}
                  >
                    {slot}
                  </button>
                )
              )}

            </div>

          </div>

          <textarea
            rows={5}
            placeholder="Describe your symptoms..."
            className="w-full border p-4 rounded-xl"
            value={symptoms}
            onChange={(e) =>
              setSymptoms(
                e.target.value
              )
            }
          />

          <div className="flex gap-4">

            <button
              onClick={() =>
                setOpen(false)
              }
              className="flex-1 border py-4 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={
                handleBook
              }
              disabled={
                loading
              }
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl"
            >
              {loading
                ? "Booking..."
                : "Book Appointment"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BookAppointmentModal;