import { useState, useEffect } from "react";
import api from "../../services/api";
import { Loader } from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toast } from "react-hot-toast";

const EMPTY_FORM = {
  name: "", email: "", password: "", specialization: "",
  qualification: "", experience: 0, consultationFee: 500, slotDuration: 30,
  workingHoursStart: "09:00", workingHoursEnd: "18:00",
};

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Leave Management State
  const [leaveDoctor, setLeaveDoctor] = useState(null);
  const [leaveDate, setLeaveDate] = useState("");
  const [isMarkingLeave, setIsMarkingLeave] = useState(false);

  // Sync these with Patient Dashboard filters
  const SPECIALIZATIONS = ["Cardiology", "Dermatology", "Neurology", "Orthopedics", "General", "Pediatrics", "Psychiatry", "ENT", "Dental"];

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/doctors");
      // Backend returns: { success, doctors: [...] }
      setDoctors(res.data.doctors || []);
    } catch (_) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        workingHours: { start: formData.workingHoursStart, end: formData.workingHoursEnd }
      };
      if (isUpdating) {
        // Exclude password if empty
        const { password, ...updatePayload } = payload;
        if (password) updatePayload.password = password;
        await api.put(`/admin/doctors/${updateId}`, updatePayload);
        toast.success("Doctor updated successfully! ✅");
        setIsUpdating(false);
      } else {
        await api.post("/admin/doctors", payload);
        toast.success("Doctor registered successfully! ✅");
        setIsCreating(false);
      }
      setFormData(EMPTY_FORM);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenUpdate = (doc) => {
    setUpdateId(doc._id);
    setFormData({
      name: doc.user?.name || "",
      email: doc.user?.email || "",
      password: "",
      specialization: doc.specialization || "",
      qualification: doc.qualification || "",
      experience: doc.experience || 0,
      consultationFee: doc.consultationFee || 500,
      slotDuration: doc.slotDuration || 30,
      workingHoursStart: doc.workingHours?.start || "09:00",
      workingHoursEnd: doc.workingHours?.end || "18:00",
    });
    setIsUpdating(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove Dr. ${name} from the system? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success("Doctor removed successfully");
      fetchDoctors();
    } catch (_) { } finally {
      setDeletingId(null);
    }
  };

  const handleMarkLeave = async (e) => {
    e.preventDefault();
    if (!leaveDate || !leaveDoctor) return;
    setIsMarkingLeave(true);
    try {
      const res = await api.put(`/admin/doctors/${leaveDoctor._id}/leave`, { date: leaveDate });
      toast.success(res.data.message || "Leave added successfully");
      setLeaveDoctor(null);
      setLeaveDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark leave");
    } finally {
      setIsMarkingLeave(false);
    }
  };

  const set = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  const filtered = doctors.filter(
    (d) =>
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-500 text-sm mt-1">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered on the platform.
          </p>
        </div>
        <Button onClick={() => { setFormData(EMPTY_FORM); setIsCreating(true); setIsUpdating(false); }}>
          + Add New Doctor
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="🔍 Search by name, email, or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slot</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                          {doc.user?.name?.charAt(0) || "D"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Dr. {doc.user?.name}</p>
                          <p className="text-xs text-gray-400">{doc.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{doc.experience || 0} yrs</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">₹{doc.consultationFee}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{doc.slotDuration || 30} min</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenUpdate(doc)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setLeaveDoctor(doc)}
                        className="text-xs font-medium text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark Leave
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id, doc.user?.name)}
                        disabled={deletingId === doc._id}
                        className="text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === doc._id ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-gray-400">
                      <div className="text-4xl mb-2">🔍</div>
                      {search ? "No doctors match your search." : "No doctors registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Update Doctor Modal */}
      {(isCreating || isUpdating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{isUpdating ? "Update Doctor Profile" : "Register New Doctor"}</h3>
                  <p className="text-purple-200 text-sm mt-0.5">{isUpdating ? "Modify doctor details and settings." : "Fill in the doctor's details to onboard them."}</p>
                </div>
                <button
                  onClick={() => { setIsCreating(false); setIsUpdating(false); }}
                  className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div className="col-span-2">
                <Input label="Full Name" type="text" required placeholder="John Smith" value={formData.name} onChange={set("name")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Email Address" type="email" required placeholder="doctor@hospital.com" value={formData.email} onChange={set("email")} />
                <Input label="Password" type="password" required={!isUpdating} placeholder={isUpdating ? "Leave blank to keep" : "Min. 6 characters"} value={formData.password} onChange={set("password")} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  value={formData.specialization}
                  onChange={set("specialization")}
                >
                  <option value="" disabled>Select a specialty...</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Qualification" type="text" required placeholder="e.g., MBBS, MD" value={formData.qualification} onChange={set("qualification")} />
                <Input label="Years of Experience" type="number" required min="0" max="60" value={formData.experience} onChange={set("experience")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Consultation Fee (₹)" type="number" min="0" required value={formData.consultationFee} onChange={set("consultationFee")} />
                <Input label="Slot Duration (min)" type="number" min="10" max="120" required value={formData.slotDuration} onChange={set("slotDuration")} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Working Hours Start" type="time" required value={formData.workingHoursStart} onChange={set("workingHoursStart")} />
                <Input label="Working Hours End" type="time" required value={formData.workingHoursEnd} onChange={set("workingHoursEnd")} />
              </div>

              {!isUpdating && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                  ⚠️ The doctor can log in immediately with these credentials.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsCreating(false); setIsUpdating(false); }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={formLoading}>
                  {isUpdating ? "Save Changes" : "Register Doctor"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Leave Modal */}
      {leaveDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5">
              <h3 className="font-bold text-white text-lg">Mark Doctor on Leave</h3>
              <p className="text-amber-100 text-sm mt-0.5">Dr. {leaveDoctor.user?.name}</p>
            </div>
            <form onSubmit={handleMarkLeave} className="p-5 space-y-4">
              <Input 
                label="Leave Date" 
                type="date" 
                required 
                min={new Date().toISOString().split("T")[0]} 
                value={leaveDate} 
                onChange={(e) => setLeaveDate(e.target.value)} 
              />
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
                ⚠️ Warning: Any existing appointments on this date will be automatically cancelled and patients will be notified.
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setLeaveDoctor(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" className="flex-1" isLoading={isMarkingLeave}>
                  Confirm Leave
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
