import { useState, useEffect } from "react";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import { Badge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const statusConfig = {
  BOOKED: { variant: "primary", label: "Upcoming", icon: "📅" },
  COMPLETED: { variant: "success", label: "Completed", icon: "✅" },
  CANCELLED: { variant: "danger", label: "Cancelled", icon: "❌" },
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expandedApt, setExpandedApt] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    setLoading(true);
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

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (_) {
      // error handled by interceptor
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = filter === "ALL" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage all your medical appointments.</p>
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
                ? "border-teal-600 text-teal-600"
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
          <p className="text-gray-500 text-sm mt-1 mb-4">
            {filter === "ALL" ? "You haven't booked any appointments yet." : `No ${filter.toLowerCase()} appointments.`}
          </p>
          {filter === "ALL" && (
            <Link to="/dashboard/doctors"><Button>Book your first appointment</Button></Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const config = statusConfig[apt.status] || { variant: "default", label: apt.status, icon: "📋" };
            const isExpanded = expandedApt === apt._id;
            const isCancelling = cancellingId === apt._id;

            return (
              <div
                key={apt._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Status color bar */}
                <div className={`h-1 ${apt.status === "COMPLETED" ? "bg-green-400" : apt.status === "CANCELLED" ? "bg-red-400" : "bg-teal-500"}`} />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Doctor Avatar */}
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-teal-200">
                      {apt.doctor?.user?.name?.charAt(0) || "D"}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900">Dr. {apt.doctor?.user?.name || "Unknown Doctor"}</h3>
                          <p className="text-sm text-gray-500">{apt.doctor?.specialization}</p>
                        </div>
                        <Badge variant={config.variant}>
                          {config.icon} {config.label}
                        </Badge>
                      </div>

                      {/* Date & Time Pills */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                          📅 {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                          🕐 {apt.startTime} – {apt.endTime}
                        </span>
                        {apt.doctor?.consultationFee && (
                          <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                            💰 ₹{apt.doctor.consultationFee}
                          </span>
                        )}
                      </div>

                      {apt.symptoms && !isExpanded && (
                        <p className="mt-2 text-xs text-gray-500 italic line-clamp-1">"{apt.symptoms}"</p>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setExpandedApt(isExpanded ? null : apt._id)}
                      className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      {isExpanded ? "▲ Show less" : "▼ View full details"}
                    </button>
                    <div className="flex gap-2">
                      {apt.status === "BOOKED" && (
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={isCancelling}
                          onClick={() => handleCancel(apt._id)}
                        >
                          Cancel Appointment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                    {apt.symptoms && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Your Symptoms</p>
                        <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">{apt.symptoms}</p>
                      </div>
                    )}

                    {apt.aiPreVisitSummary && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">🧠 AI Pre-Visit Summary</p>
                        <div className="space-y-1 text-sm text-blue-800">
                          {apt.aiPreVisitSummary.urgencyLevel && <p><strong>Urgency:</strong> {apt.aiPreVisitSummary.urgencyLevel}</p>}
                          {apt.aiPreVisitSummary.chiefComplaint && <p><strong>Chief Complaint:</strong> {apt.aiPreVisitSummary.chiefComplaint}</p>}
                          {apt.aiPreVisitSummary.suggestedQuestions?.length > 0 && (
                            <div>
                              <p className="font-medium mt-2">Questions for your Doctor:</p>
                              <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
                                {apt.aiPreVisitSummary.suggestedQuestions.map((q, i) => (
                                  <li key={i}>{q}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {apt.status === "COMPLETED" && (
                      <>
                        {apt.postVisitNotes && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Doctor's Notes</p>
                            <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">{apt.postVisitNotes}</p>
                          </div>
                        )}
                        {apt.prescription && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">💊 Prescription</p>
                            <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">{apt.prescription}</p>
                          </div>
                        )}
                        {apt.aiPostVisitSummary?.summary && (
                          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">🤖 AI Post-Visit Summary</p>
                            <p className="text-sm text-teal-800">{apt.aiPostVisitSummary.summary}</p>
                            {apt.aiPostVisitSummary.followUpSteps && (
                              <p className="text-sm text-teal-800 mt-2"><strong>Follow-up:</strong> {apt.aiPostVisitSummary.followUpSteps}</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
