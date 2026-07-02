import { useState, useEffect } from "react";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { toast } from "react-hot-toast";

const statusConfig = {
  BOOKED: { variant: "primary", label: "Booked" },
  COMPLETED: { variant: "success", label: "Completed" },
  CANCELLED: { variant: "danger", label: "Cancelled" },
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedApt, setSelectedApt] = useState(null);
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [medications, setMedications] = useState([]); // [{ medicineName: "", frequency: "once" }]
  const [savingNotes, setSavingNotes] = useState(false);
  const [expandedApt, setExpandedApt] = useState(null);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/appointments");
      setAppointments(res.data.appointments || []);
    } catch (_) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNotes = (apt) => {
    setSelectedApt(apt);
    setNotes(apt.postVisitNotes || "");
    setPrescription(apt.prescription || "");
    setMedications([]);
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    setSavingNotes(true);
    try {
      // Backend reads `notes` field — we send both for resilience
      await api.post(`/doctor/appointments/${selectedApt._id}/notes`, {
        notes,
        postVisitNotes: notes,
        prescription,
        medications
      });
      toast.success("Consultation completed! AI summary is generating... 🧠");
      setSelectedApt(null);
      fetchAppointments();
    } catch (_) { } finally {
      setSavingNotes(false);
    }
  };

  const filtered = filter === "ALL" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Review patient details and complete consultations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
        {[
          { key: "ALL", label: `All (${appointments.length})` },
          { key: "BOOKED", label: `Pending (${appointments.filter(a => a.status === "BOOKED").length})` },
          { key: "COMPLETED", label: `Done (${appointments.filter(a => a.status === "COMPLETED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab.key ? "border-teal-600 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700"
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
          <div className="text-5xl mb-3">📭</div>
          <h3 className="font-semibold text-gray-700">No appointments found</h3>
          <p className="text-gray-500 text-sm mt-1">Appointments booked by patients will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const config = statusConfig[apt.status] || { variant: "default", label: apt.status };
            const isExpanded = expandedApt === apt._id;

            return (
              <div key={apt._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Status indicator bar */}
                <div className={`h-1 ${apt.status === "COMPLETED" ? "bg-green-400" : apt.status === "CANCELLED" ? "bg-red-400" : "bg-teal-500"}`} />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Patient Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
                      {apt.patient?.name?.charAt(0) || "P"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{apt.patient?.name}</h3>
                          <p className="text-xs text-gray-500">{apt.patient?.email}</p>
                        </div>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>

                      {/* Date/Time Pills */}
                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-full">
                          📅 {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-full">
                          🕐 {apt.startTime} – {apt.endTime}
                        </span>
                      </div>

                      {apt.symptoms && !isExpanded && (
                        <p className="text-xs text-gray-500 italic mt-2 line-clamp-1">
                          Symptoms: "{apt.symptoms}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setExpandedApt(isExpanded ? null : apt._id)}
                      className="text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      {isExpanded ? "▲ Show less" : "▼ View patient details"}
                    </button>
                    {apt.status === "BOOKED" && (
                      <Button size="sm" onClick={() => handleOpenNotes(apt)}>
                        ✓ Complete Consultation
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                    {apt.symptoms && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Patient Symptoms</p>
                        <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">{apt.symptoms}</p>
                      </div>
                    )}

                    {apt.aiPreVisitSummary && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">🧠 AI Pre-Visit Analysis</p>
                        <div className="space-y-2 text-sm">
                          {apt.aiPreVisitSummary.urgencyLevel && (
                            <span className="inline-block text-xs font-medium bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                              Urgency: {apt.aiPreVisitSummary.urgencyLevel}
                            </span>
                          )}
                          {apt.aiPreVisitSummary.chiefComplaint && (
                            <p className="text-blue-800"><strong>Chief Complaint:</strong> {apt.aiPreVisitSummary.chiefComplaint}</p>
                          )}
                          {apt.aiPreVisitSummary.suggestedQuestions?.length > 0 && (
                            <div>
                              <p className="font-medium text-blue-800">Suggested Questions:</p>
                              <ul className="list-disc list-inside text-xs text-blue-700 space-y-0.5 mt-1">
                                {apt.aiPreVisitSummary.suggestedQuestions.map((q, i) => <li key={i}>{q}</li>)}
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
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your Notes</p>
                            <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">{apt.postVisitNotes}</p>
                          </div>
                        )}
                        {apt.prescription && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">💊 Prescription</p>
                            <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">{apt.prescription}</p>
                          </div>
                        )}
                        {apt.aiPostVisitSummary?.summary && (
                          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">🤖 AI Post-Visit Summary</p>
                            <p className="text-sm text-green-800">{apt.aiPostVisitSummary.summary}</p>
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

      {/* Notes Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">Complete Consultation</h3>
                  <p className="text-teal-100 text-sm mt-0.5">
                    {selectedApt.patient?.name} · {new Date(selectedApt.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApt(null)}
                  className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveNotes} className="p-5 space-y-5">
              {selectedApt.symptoms && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Patient's Reported Symptoms</p>
                  <p className="text-sm text-amber-800">{selectedApt.symptoms}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Post-Visit Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none resize-none"
                  rows="4"
                  required
                  placeholder="Diagnosis, findings, treatment plan, and observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  General Prescription Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none resize-none"
                  rows="2"
                  placeholder="E.g., Drink plenty of water and rest..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                />
              </div>

              {/* Dynamic Medications Section */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Automated Medication Reminders
                  </label>
                  <button
                    type="button"
                    onClick={() => setMedications([...medications, { medicineName: "", frequency: "once" }])}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded transition-colors"
                  >
                    + Add Medicine
                  </button>
                </div>
                
                {medications.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No automated reminders added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {medications.map((med, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          required
                          placeholder="Medicine Name (e.g., Aspirin)"
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          value={med.medicineName}
                          onChange={(e) => {
                            const newMeds = [...medications];
                            newMeds[index].medicineName = e.target.value;
                            setMedications(newMeds);
                          }}
                        />
                        <select
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                          value={med.frequency}
                          onChange={(e) => {
                            const newMeds = [...medications];
                            newMeds[index].frequency = e.target.value;
                            setMedications(newMeds);
                          }}
                        >
                          <option value="once">Once daily</option>
                          <option value="twice">Twice daily</option>
                          <option value="thrice">Thrice daily</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newMeds = [...medications];
                            newMeds.splice(index, 1);
                            setMedications(newMeds);
                          }}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs text-teal-700">
                💡 After saving, our AI will automatically generate a post-visit summary for the patient.
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedApt(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={savingNotes}>
                  Save & Complete Visit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
