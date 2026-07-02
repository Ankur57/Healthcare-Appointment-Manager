import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import { Badge } from "../../components/ui/Badge";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/doctor/appointments");
        // Backend returns: { success, count, appointments: [...] }
        setAppointments(res.data.appointments || []);
      } catch (_) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate).toDateString() === today
  );
  const pendingCount = appointments.filter((a) => a.status === "BOOKED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-200 text-sm font-medium">{greetingTime()}, Doctor</p>
            <h1 className="text-2xl font-bold mt-1">Dr. {user?.name} 🩺</h1>
            <p className="text-teal-100 text-sm mt-1">
              You have{" "}
              <span className="font-bold text-white">{todaysAppointments.length}</span>{" "}
              patient{todaysAppointments.length !== 1 ? "s" : ""} scheduled today.
            </p>
          </div>
          <Link
            to="/doctor/appointments"
            className="bg-white text-teal-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
          >
            View All Appointments →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today's Patients", value: todaysAppointments.length, icon: "👥", color: "border-teal-200 bg-teal-50" },
          { label: "Total Appointments", value: appointments.length, icon: "📋", color: "border-blue-200 bg-blue-50" },
          { label: "Pending", value: pendingCount, icon: "⏳", color: "border-amber-200 bg-amber-50" },
          { label: "Completed", value: completedCount, icon: "✅", color: "border-green-200 bg-green-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <span className="text-2xl mb-2 block">{s.icon}</span>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : todaysAppointments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <div className="text-5xl mb-3">🗓️</div>
            <h3 className="font-semibold text-gray-700">No patients today</h3>
            <p className="text-gray-500 text-sm mt-1">
              You have no appointments scheduled for today.{" "}
              {appointments.length > 0 && (
                <Link to="/doctor/appointments" className="text-teal-600 font-medium hover:underline">
                  View all {appointments.length} appointments →
                </Link>
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysAppointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="text-center w-14 flex-shrink-0 bg-teal-50 rounded-lg py-2">
                  <p className="text-xs font-bold text-teal-700">{apt.startTime}</p>
                  <div className="w-px h-3 bg-teal-200 mx-auto my-1" />
                  <p className="text-xs text-gray-400">{apt.endTime}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">
                  {apt.patient?.name?.charAt(0) || "P"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{apt.patient?.name}</p>
                  <p className="text-xs text-gray-400">{apt.patient?.email}</p>
                  {apt.symptoms && (
                    <p className="text-xs text-gray-500 truncate italic mt-0.5">"{apt.symptoms}"</p>
                  )}
                </div>
                <Badge variant={apt.status === "BOOKED" ? "primary" : "success"}>
                  {apt.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}