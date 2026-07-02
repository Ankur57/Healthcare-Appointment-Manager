import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaRobot,
} from "react-icons/fa";

function AppointmentCard({
  appointment,
  handleCancel,
}) {
  if (!appointment) {
    console.log("Null value is returned ")
    return null;
  }
  return (
    <div className="bg-white p-8 rounded-3xl shadow-md">

      <div className="flex justify-between">

        <div>
          

          <h2 className="text-2xl font-bold flex items-center gap-3">

            <FaUserMd
              className="text-blue-600"
            />

            Dr.
            {
              appointment
                .doctor
                ?.user?.name
            }

          </h2>

          <p className="text-gray-500 mt-2">
            {
              appointment
                .doctor
                ?.specialization
            }
          </p>

          <div className="flex gap-6 mt-5 text-gray-600">

            <div className="flex gap-2 items-center">
              <FaCalendarAlt />

              {new Date(
                appointment.appointmentDate
              ).toDateString()}
            </div>

            <div className="flex gap-2 items-center">
              <FaClock />

              {
                appointment.startTime
              }
            </div>

          </div>

          <p className="mt-5">
            <span className="font-semibold">
              Symptoms:
            </span>

            {" "}
            {
              appointment.symptoms
            }
          </p>

        </div>

        <div>

          <span
            className={`px-5 py-2 rounded-full text-sm font-semibold
            ${
              appointment.status ===
              "BOOKED"
                ? "bg-green-100 text-green-700"
                : ""
            }
            ${
              appointment.status ===
              "COMPLETED"
                ? "bg-blue-100 text-blue-700"
                : ""
            }
            ${
              appointment.status ===
              "CANCELLED"
                ? "bg-red-100 text-red-700"
                : ""
            }`}
          >
            {
              appointment.status
            }
          </span>

        </div>

      </div>

      {appointment
        .aiPreVisitSummary && (
        <div className="mt-8 bg-blue-50 p-6 rounded-2xl">

          <h3 className="font-bold text-lg flex gap-3 items-center">

            <FaRobot />

            AI Summary

          </h3>

          <p className="mt-4">
            <strong>
              Urgency:
            </strong>

            {" "}
            {
              appointment
                .aiPreVisitSummary
                .urgencyLevel
            }
          </p>

          <p className="mt-2">
            <strong>
              Chief Complaint:
            </strong>

            {" "}
            {
              appointment
                .aiPreVisitSummary
                .chiefComplaint
            }
          </p>

        </div>
      )}

      {appointment.status ===
        "BOOKED" && (
        <button
          onClick={() =>
            handleCancel(
              appointment._id
            )
          }
          className="mt-8 bg-red-600 text-white px-6 py-3 rounded-xl"
        >
          Cancel Appointment
        </button>
      )}

    </div>
  );
}

export default AppointmentCard;