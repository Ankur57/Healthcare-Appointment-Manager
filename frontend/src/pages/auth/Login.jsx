import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const res = await login(formData);
      toast.success("Welcome back!");
      const role = res.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else navigate("/dashboard");
    } catch (_) {
      // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-white text-lg backdrop-blur-sm">
              M
            </div>
            <span className="text-white font-bold text-2xl">MediFlow</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Your health,<br />our priority.
            </h2>
            <p className="text-teal-100 text-lg leading-relaxed">
              Access your appointments, prescriptions, and AI health summaries in one place.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { stat: "10K+", label: "Patients" },
            { stat: "500+", label: "Doctors" },
            { stat: "98%", label: "Satisfaction" },
            { stat: "24/7", label: "Support" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-white font-bold text-2xl">{s.stat}</p>
              <p className="text-teal-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-white">M</div>
            <span className="font-bold text-xl text-teal-900">MediFlow</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
              <p className="text-gray-500 mt-1">Welcome back! Enter your credentials below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
                Sign in
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
                Create one for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}