import { Link } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <FaHeartbeat
            className="text-blue-600 text-3xl"
          />

          <h1 className="text-3xl font-bold text-blue-600">
            MediFlow
          </h1>
        </Link>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#features">
            Features
          </a>

          <a href="#how">
            How It Works
          </a>

          <a href="#specializations">
            Doctors
          </a>

          <a href="#testimonials">
            Reviews
          </a>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;