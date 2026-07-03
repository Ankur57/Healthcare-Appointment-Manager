import { useState, useEffect } from "react";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import { Badge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const statusConfig = {
  BOOKED: { variant: "primary", label: "Upcoming", icon: "📅" },
  COMPLETED: { variant: "success", label: "Completed", icon: "✅" },
  CANCELLED: { variant: "danger", label: "Cancelled", icon: "❌" },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/appointments");
      setAppointments(res.data.appointments || []);
    } catch (_) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "ALL" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor platform-wide consultations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
        {[
          { key: "ALL", label: `All (${appointments.length})` },
          { key: "BOOKED", label: `Upcoming (${appointments.filter(a => a.status === "BOOKED").length})` },
          { key: "COMPLETED", label: `Completed (${appointments.filter(a => a.status === "COMPLETED").length})` },
          { key: "CANCELLED", label: `Cancelled (${appointments.filter(a => a.status === "CANCELLED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab.key
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <div className="text-5xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-700">No appointments found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const config = statusConfig[apt.status] || { variant: "default", label: apt.status, icon: "📋" };

            return (
              <div
                key={apt._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className={`h-1 ${apt.status === "COMPLETED" ? "bg-green-400" : apt.status === "CANCELLED" ? "bg-red-400" : "bg-purple-500"}`} />
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={config.variant}>{config.icon} {config.label}</Badge>
                        <span className="text-xs font-semibold text-gray-400">ID: {apt._id.slice(-6)}</span>
                      </div>
                      <h3 className="font-bold text-gray-900">Patient: {apt.patient?.name || "Unknown"}</h3>
                      <p className="text-sm text-gray-600">Doctor: Dr. {apt.doctor?.user?.name || "Unknown"}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-1 min-w-[200px]">
                      <span className="text-xs text-gray-500 flex justify-between">
                        <span>Date:</span> 
                        <strong className="text-gray-900">{new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
                      </span>
                      <span className="text-xs text-gray-500 flex justify-between">
                        <span>Time:</span> 
                        <strong className="text-gray-900">{apt.startTime} – {apt.endTime}</strong>
                      </span>
                      {apt.doctor?.consultationFee && (
                        <span className="text-xs text-gray-500 flex justify-between">
                          <span>Fee:</span> 
                          <strong className="text-gray-900">₹{apt.doctor.consultationFee}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
