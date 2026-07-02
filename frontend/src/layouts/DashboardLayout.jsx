import {
  Link,
  Outlet,
} from "react-router-dom";

import {
  FaHeartbeat,
  FaHome,
  FaUserMd,
  FaCalendarCheck,
  FaUser,
} from "react-icons/fa";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <aside className="w-72 bg-white shadow-xl p-8">

        <div className="flex items-center gap-3">

          <FaHeartbeat className="text-blue-600 text-4xl" />

          <h1 className="text-3xl font-bold text-blue-600">
            MediFlow
          </h1>

        </div>

        <div className="mt-12 space-y-4">

          <Link
            to="/dashboard"
            className="flex gap-4 p-4 rounded-xl hover:bg-blue-50"
          >
            <FaHome />

            Dashboard
          </Link>

          <Link
            to="/doctors"
            className="flex gap-4 p-4 rounded-xl hover:bg-blue-50"
          >
            <FaUserMd />

            Doctors
          </Link>

          <Link
            to="/appointments"
            className="flex gap-4 p-4 rounded-xl hover:bg-blue-50"
          >
            <FaCalendarCheck />

            Appointments
          </Link>

          <Link
            to="/profile"
            className="flex gap-4 p-4 rounded-xl hover:bg-blue-50"
          >
            <FaUser />

            Profile
          </Link>

        </div>

      </aside>

      <main className="flex-1 p-10">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;