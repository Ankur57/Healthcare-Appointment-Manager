import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/my");
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

  const upcomingAppointments = appointments.filter((a) => a.status === "BOOKED");
  const completedAppointments = appointments.filter((a) => a.status === "COMPLETED");
  const cancelledAppointments = appointments.filter((a) => a.status === "CANCELLED");

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-200 text-sm font-medium">{greetingTime()},</p>
            <h1 className="text-2xl font-bold mt-1">{user?.name} 👋</h1>
            <p className="text-teal-100 text-sm mt-1">Here's your health overview for today.</p>
          </div>
          <Link to="/dashboard/doctors">
            <Button variant="secondary" className="shadow-sm">
              + Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Appointments", value: appointments.length, icon: "📋", color: "border-blue-200 bg-blue-50" },
          { label: "Upcoming", value: upcomingAppointments.length, icon: "⏳", color: "border-teal-200 bg-teal-50" },
          { label: "Completed", value: completedAppointments.length, icon: "✅", color: "border-green-200 bg-green-50" },
          { label: "Cancelled", value: cancelledAppointments.length, icon: "❌", color: "border-red-200 bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
          <Link to="/dashboard/appointments" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <div className="text-5xl mb-3">🏥</div>
            <h3 className="font-semibold text-gray-700 mb-1">No upcoming appointments</h3>
            <p className="text-gray-500 text-sm mb-4">Browse our verified doctors and book your first appointment.</p>
            <Link to="/dashboard/doctors">
              <Button>Find a Doctor</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAppointments.slice(0, 4).map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl border border-l-4 border-l-teal-500 border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center flex-shrink-0">
                      {apt.doctor?.user?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Dr. {apt.doctor?.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{apt.doctor?.specialization}</p>
                    </div>
                  </div>
                  <Badge variant="primary">{apt.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">
                  <span>📅 {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>🕐 {apt.startTime} – {apt.endTime}</span>
                </div>
                {apt.symptoms && (
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 italic">"{apt.symptoms}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Find a Doctor", desc: "Browse by specialty", icon: "👨‍⚕️", href: "/dashboard/doctors", color: "hover:border-teal-300 hover:bg-teal-50" },
            { label: "My Appointments", desc: "View full history", icon: "📅", href: "/dashboard/appointments", color: "hover:border-blue-300 hover:bg-blue-50" },
            { label: "Book Appointment", desc: "Schedule a visit", icon: "➕", href: "/dashboard/doctors", color: "hover:border-green-300 hover:bg-green-50" },
          ].map((action) => (
            <Link key={action.label} to={action.href}>
              <div className={`border border-gray-200 rounded-xl p-4 bg-white cursor-pointer transition-all hover:shadow-sm ${action.color}`}>
                <span className="text-3xl mb-2 block">{action.icon}</span>
                <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}