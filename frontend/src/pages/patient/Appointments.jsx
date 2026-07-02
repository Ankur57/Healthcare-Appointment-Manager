import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AppointmentList from "../../components/patient/AppointmentList";
import {
  getMyAppointments,
  cancelAppointment,
} from "../../services/appointment.service";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getMyAppointments();
      console.log(data);
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center">
          <h2 className="text-2xl font-bold">No appointments yet</h2>
        </div>
      ) : (
        <AppointmentList
          appointments={appointments}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default Appointments;