import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaCalendarCheck,
  FaRobot,
} from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-cyan-50">

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <h1 className="text-6xl font-bold leading-tight text-gray-800">
            Smarter
            <span className="text-blue-600">
              {" "}Healthcare
            </span>
            <br />
            Starts Here.
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            Book appointments,
            get AI symptom summaries,
            receive medication reminders,
            and manage your healthcare
            effortlessly.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Book Appointment
            </Link>

            <button
              className="border px-8 py-4 rounded-xl font-semibold"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1612277795421-9bc7706a4a41"
            className="rounded-3xl shadow-2xl"
          />

          <div className="absolute top-6 left-6 bg-white p-4 rounded-xl shadow-lg">
            <FaUserMd
              className="text-blue-600 text-3xl"
            />

            <p className="font-semibold mt-2">
              150+ Doctors
            </p>
          </div>

          <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg">
            <FaCalendarCheck
              className="text-green-600 text-3xl"
            />

            <p className="font-semibold mt-2">
              5K+ Appointments
            </p>
          </div>

          <div className="absolute top-1/2 -left-6 bg-white p-4 rounded-xl shadow-lg">
            <FaRobot
              className="text-cyan-600 text-3xl"
            />

            <p className="font-semibold mt-2">
              AI Summaries
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;