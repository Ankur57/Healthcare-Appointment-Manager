import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctor } from "../../services/api"; // adjust import path as needed
import { toast } from "react-hot-toast";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctor(id);
        setDoctor(data);
      } catch (err) {
        toast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>Doctor not found</div>;

  const handleBookClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmBooking = (appointmentData) => {
    // Here you would call your API to create the appointment
    // For example:
    // await api.post("/appointments", appointmentData);
    toast.success("Appointment booked successfully!");
    setShowModal(false);
    navigate("/dashboard"); // or wherever you want to redirect
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-lg">
      <h1 className="text-4xl font-bold text-blue-600">{doctor.name}</h1>
      <p className="text-xl text-gray-600 mt-2">{doctor.specialization}</p>
      <p className="text-gray-500 mt-4">{doctor.description}</p>

      <button
        onClick={handleBookClick}
        className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold"
      >
        Book Appointment
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Book Appointment
            </h2>
            <AppointmentForm
              doctor={doctor}
              onClose={handleCloseModal}
              onConfirm={handleConfirmBooking}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// AppointmentForm component (can be in a separate file)
function AppointmentForm({ doctor, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    symptoms: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      doctorId: doctor._id,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="date"
        name="appointmentDate"
        placeholder="Select Date"
        className="w-full p-4 border rounded-xl"
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="startTime"
        placeholder="Select Time"
        className="w-full p-4 border rounded-xl"
        onChange={handleChange}
        required
      />
      <textarea
        name="symptoms"
        placeholder="Describe your symptoms"
        className="w-full p-4 border rounded-xl"
        onChange={handleChange}
        required
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="w-full border px-6 py-3 rounded-xl font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Confirm
        </button>
      </div>
    </form>
  );
}

export default DoctorDetails;