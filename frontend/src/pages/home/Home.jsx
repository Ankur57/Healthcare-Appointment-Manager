import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";

const features = [
  {
    title: "AI-Powered Summaries",
    description: "Get intelligent pre-visit and post-visit summaries powered by Gemini AI, saving you valuable consultation time.",
    icon: "🧠",
    color: "from-violet-50 to-purple-50 border-violet-100",
    iconBg: "bg-violet-100 text-violet-700",
  },
  {
    title: "Smart Scheduling",
    description: "Book appointments instantly with real-time slot availability and automatic double-booking prevention.",
    icon: "📅",
    color: "from-teal-50 to-cyan-50 border-teal-100",
    iconBg: "bg-teal-100 text-teal-700",
  },
  {
    title: "Medication Reminders",
    description: "Never miss a dose. Our automated notification system keeps you on track with your health plan.",
    icon: "💊",
    color: "from-blue-50 to-sky-50 border-blue-100",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    title: "Google Calendar Sync",
    description: "Appointments sync automatically to your Google Calendar so they're always in your schedule.",
    icon: "📆",
    color: "from-amber-50 to-orange-50 border-amber-100",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    title: "Secure Health Records",
    description: "Your health records and prescriptions are encrypted and accessible only to authorized personnel.",
    icon: "🔒",
    color: "from-green-50 to-emerald-50 border-green-100",
    iconBg: "bg-green-100 text-green-700",
  },
  {
    title: "Role-Based Access",
    description: "Separate, tailored experiences for Patients, Doctors, and Admins with role-based dashboards.",
    icon: "👥",
    color: "from-rose-50 to-pink-50 border-rose-100",
    iconBg: "bg-rose-100 text-rose-700",
  },
];

const howItWorks = [
  { step: "01", title: "Create Account", desc: "Register as a patient in under 60 seconds. No paperwork required." },
  { step: "02", title: "Find a Doctor", desc: "Browse verified specialists by name or specialty and view their availability." },
  { step: "03", title: "Book a Slot", desc: "Select an open time slot, describe your symptoms, and confirm your booking." },
  { step: "04", title: "Get AI Insights", desc: "Receive an AI pre-visit summary and, after your visit, a detailed post-visit report." },
];

const testimonials = [
  { name: "Sarah K.", role: "Patient", text: "Booking an appointment took less than 2 minutes. The AI summary before my visit helped the doctor understand my issues instantly.", avatar: "SK" },
  { name: "Dr. Rohit M.", role: "Cardiologist", text: "MediFlow has streamlined my entire workflow. The AI post-visit notes save me 30 minutes per patient.", avatar: "RM" },
  { name: "Priya S.", role: "Patient", text: "The medication reminders are a lifesaver! I never miss a dose anymore. A truly well-designed platform.", avatar: "PS" },
];

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.3)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              Now with Gemini AI Integration
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
              Healthcare,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                Reimagined.
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-10">
              MediFlow connects patients, doctors, and administrators in one intelligent platform. AI-powered scheduling, smart reminders, and seamless care — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 text-base">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login" className="flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors">
                Sign in to account
                <span className="text-teal-400">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Right side stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 grid grid-cols-2 gap-4 max-w-sm w-full"
          >
            {[
              { stat: "10,000+", label: "Patients Served", icon: "👥" },
              { stat: "500+", label: "Verified Doctors", icon: "👨‍⚕️" },
              { stat: "98%", label: "Satisfaction Rate", icon: "⭐" },
              { stat: "24/7", label: "Platform Access", icon: "🕐" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl mb-3 block">{s.icon}</span>
                <p className="text-2xl font-bold text-white">{s.stat}</p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Platform Features</span>
            <h2 className="mt-3 text-4xl font-bold text-gray-900">Everything you need for modern healthcare</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Designed from the ground up for efficiency, privacy, and an outstanding user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${feature.color} hover:shadow-md transition-shadow`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${feature.iconBg} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">How It Works</span>
            <h2 className="mt-3 text-4xl font-bold text-gray-900">Book an appointment in 4 simple steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-3 text-4xl font-bold text-gray-900">Loved by patients and doctors alike</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                  <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-900 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-teal-100 text-lg mb-10">
            Join over 10,000 patients and 500 doctors already using MediFlow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Get started — it's free
              </Button>
            </Link>
            <Link to="/login" className="text-teal-100 hover:text-white font-medium">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">M</div>
              <span className="font-bold text-white">MediFlow</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} MediFlow. Built with ❤️ for better healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}