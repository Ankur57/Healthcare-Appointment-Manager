import { useState, useEffect } from "react";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({ date: "", startTime: "", endTime: "", symptoms: "" });
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/patient/doctors");
      // Backend returns: { success, doctors: [...] }
      setDoctors(res.data.doctors || []);
    } catch (_) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingData({ date: "", startTime: "", endTime: "", symptoms: "" });
    setSlots([]);
  };

  const fetchSlots = async (doctorId, date) => {
    if (!date) return;
    setSlotsLoading(true);
    try {
      const res = await api.get(`/patient/doctors/${doctorId}/slots?date=${date}`);
      // Backend returns: { success, slots: [...] }
      setSlots(res.data.slots || []);
    } catch (_) {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBookingData({ ...bookingData, date, startTime: "", endTime: "" });
    if (selectedDoctor) fetchSlots(selectedDoctor._id, date);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      await api.post("/appointments", {
        doctorId: selectedDoctor._id,
        appointmentDate: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        symptoms: bookingData.symptoms,
      });
      toast.success("Appointment booked successfully! 🎉");
      setSelectedDoctor(null);
      navigate("/dashboard/appointments");
    } catch (_) { } finally {
      setIsBooking(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
          <p className="text-gray-500 text-sm mt-1">Browse our verified specialists and book an appointment.</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="🔍 Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Specialty Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Cardiology", "Dermatology", "Neurology", "Orthopedics", "General", "Pediatrics", "Psychiatry", "ENT", "Dental"].map((s) => (
          <button
            key={s}
            onClick={() => setSearch(s === "All" ? "" : s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              (s === "All" && search === "") || search.toLowerCase() === s.toLowerCase()
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-700">No doctors found</h3>
          <p className="text-gray-500 text-sm mt-1">Try a different name or specialty.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-teal-50 to-white p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-200">
                    {doc.user?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Dr. {doc.user?.name}</h3>
                    <span className="inline-block text-xs font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full mt-1">
                      {doc.specialization}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Experience", value: `${doc.experience || 0} yrs` },
                    { label: "Fee", value: `₹${doc.consultationFee}` },
                    { label: "Slot", value: `${doc.slotDuration || 30} min` },
                  ].map((info) => (
                    <div key={info.label} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-gray-900">{info.value}</p>
                      <p className="text-xs text-gray-400">{info.label}</p>
                    </div>
                  ))}
                </div>

                {doc.qualification && (
                  <p className="text-xs text-gray-500 mb-3">🎓 {doc.qualification}</p>
                )}

                <Button className="w-full" onClick={() => handleSelectDoctor(doc)}>
                  Book Appointment
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">Book Appointment</h3>
                  <p className="text-teal-100 text-sm mt-0.5">Dr. {selectedDoctor.user?.name} · {selectedDoctor.specialization}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <Input
                label="Select Date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={bookingData.date}
                onChange={handleDateChange}
              />

              {bookingData.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                  {slotsLoading ? (
                    <div className="py-4"><Loader size="sm" /></div>
                  ) : slots.length === 0 ? (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 text-center">
                      No available slots for this date. Try another day.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, startTime: slot.startTime, endTime: slot.endTime })}
                          className={`py-2 px-1 text-xs font-medium border rounded-xl transition-all ${
                            bookingData.startTime === slot.startTime
                              ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                              : "bg-gray-50 text-gray-700 hover:border-teal-300 hover:bg-teal-50 border-gray-200"
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Describe Your Symptoms <span className="text-gray-400 font-normal">(optional — helps AI generate a pre-visit summary)</span>
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none resize-none"
                  rows="3"
                  placeholder="E.g., I've been having chest pain and shortness of breath for 2 days..."
                  value={bookingData.symptoms}
                  onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                />
              </div>

              {bookingData.startTime && (
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-sm">
                  <p className="font-medium text-teal-900">Booking Summary</p>
                  <p className="text-teal-700 text-xs mt-1">
                    {new Date(bookingData.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    {" at "}{bookingData.startTime} – {bookingData.endTime}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedDoctor(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  isLoading={isBooking}
                  disabled={!bookingData.date || !bookingData.startTime}
                  onClick={handleBook}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}