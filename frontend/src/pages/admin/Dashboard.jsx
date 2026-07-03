import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toast } from "react-hot-toast";

const EMPTY_FORM = {
  name: "", email: "", password: "", specialization: "",
  qualification: "", experience: 0, consultationFee: 500, slotDuration: 30,
};

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, aptRes] = await Promise.all([
        api.get("/admin/doctors"),
        api.get("/admin/appointments")
      ]);
      setDoctors(docRes.data.doctors || []);
      setAppointments(aptRes.data.appointments || []);
    } catch (_) {
      setDoctors([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))];
  const avgFee = doctors.length
    ? Math.round(doctors.reduce((s, d) => s + (d.consultationFee || 0), 0) / doctors.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-purple-200 text-sm font-medium">Admin Control Panel</p>
            <h1 className="text-2xl font-bold mt-1">System Overview 🏥</h1>
            <p className="text-purple-100 text-sm mt-1">Manage doctors, appointments, and platform operations.</p>
          </div>
          <Link
            to="/admin/doctors"
            className="bg-white text-purple-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors"
          >
            Manage Doctors →
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="py-12"><Loader /></div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Doctors", value: doctors.length, icon: "👨‍⚕️", color: "border-teal-200 bg-teal-50" },
            { label: "Total Appointments", value: appointments.length, icon: "📅", color: "border-blue-200 bg-blue-50" },
            { label: "Avg. Consultation Fee", value: avgFee > 0 ? `₹${avgFee}` : "—", icon: "💰", color: "border-green-200 bg-green-50" },
            { label: "Platform Status", value: "Active", icon: "✅", color: "border-emerald-200 bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Doctors Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Registered Doctors</h2>
          <Link to="/admin/doctors" className="text-sm font-medium text-purple-600 hover:text-purple-700">
            Manage all →
          </Link>
        </div>

        {loading ? null : doctors.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <h3 className="font-semibold text-gray-700">No doctors added yet</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Start by adding a doctor to the system.</p>
            <Link to="/admin/doctors"><Button>Add First Doctor</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 6).map((doc) => (
              <div key={doc._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className="w-11 h-11 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                  {doc.user?.name?.charAt(0) || "D"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">Dr. {doc.user?.name}</p>
                  <p className="text-xs text-gray-500">{doc.specialization}</p>
                  <p className="text-xs text-gray-400 mt-0.5">₹{doc.consultationFee} · {doc.experience || 0} yrs</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointments Overview */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
          <Link to="/admin/appointments" className="text-sm font-medium text-purple-600 hover:text-purple-700">
            View all →
          </Link>
        </div>

        {loading ? null : appointments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <div className="text-5xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-700">No appointments yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.slice(0, 6).map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${apt.status === "COMPLETED" ? "bg-green-100 text-green-800" : apt.status === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                    {apt.status}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">Patient: {apt.patient?.name}</p>
                <p className="text-xs text-gray-600 truncate">Doctor: Dr. {apt.doctor?.user?.name}</p>
                <p className="text-xs text-gray-500 mt-1">Time: {apt.startTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}