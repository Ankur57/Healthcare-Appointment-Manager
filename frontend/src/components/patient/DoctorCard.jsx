import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaStar,
} from "react-icons/fa";

function DoctorCard({
  doctor,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 hover:shadow-xl transition">

      <div className="flex justify-between">

        <div>

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

            <FaUserMd className="text-blue-600 text-4xl" />

          </div>

          <h2 className="text-2xl font-bold mt-5">
            Dr. {doctor.user.name}
          </h2>

          <p className="text-gray-500">
            {doctor.specialization}
          </p>

          <p className="mt-3">
            {doctor.experience} years experience
          </p>

          <p className="mt-2 font-semibold text-green-600">
            ₹{doctor.consultationFee}
          </p>

          <div className="flex gap-2 mt-3 text-yellow-500">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

        </div>

      </div>

      <Link
        to={`/doctor/${doctor._id}`}
        className="block mt-8 bg-blue-600 text-white text-center py-3 rounded-xl"
      >
        View Profile
      </Link>

    </div>
  );
}

export default DoctorCard;