import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

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
      await registerUser(formData);
      toast.success("Account created successfully!");
      navigate("/dashboard");
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
              Healthcare that<br />works for you.
            </h2>
            <p className="text-teal-100 text-lg leading-relaxed">
              Join thousands of patients managing their health smarter with AI-powered care.
            </p>
          </div>
        </div>
        <div className="relative z-10 space-y-3">
          {[
            "✓ Book appointments with verified doctors",
            "✓ AI pre & post visit health summaries",
            "✓ Automated medication reminders",
            "✓ Secure health record management",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 text-teal-100">
              <span>{f}</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-gray-500 mt-1">Start your health journey with MediFlow today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
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
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
                Create account
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}