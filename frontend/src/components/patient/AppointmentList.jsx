import AppointmentCard
from "./AppointmentCard";

function AppointmentList({
  appointments,
  handleCancel,
}) {
  return (
    <div className="space-y-8">

      {appointments.map(
        (
          appointment
        ) => (
          <AppointmentCard
            key={
              appointment._id
            }
            appointment={
              appointment
            }
            handleCancel={
              handleCancel
            }
          />
        )
      )}

    </div>
  );
}

export default AppointmentList;