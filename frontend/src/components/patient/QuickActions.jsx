import {
  Link,
} from "react-router-dom";

function QuickActions() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">

        <Link
          to="/doctors"
          className="block bg-blue-50 p-5 rounded-2xl hover:bg-blue-100"
        >
          Find Doctors
        </Link>

        <Link
          to="/appointments"
          className="block bg-green-50 p-5 rounded-2xl hover:bg-green-100"
        >
          My Appointments
        </Link>

        <Link
          to="/profile"
          className="block bg-purple-50 p-5 rounded-2xl hover:bg-purple-100"
        >
          Profile
        </Link>

      </div>

    </div>
  );
}

export default QuickActions;