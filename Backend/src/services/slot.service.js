import Appointment
from "../models/Appointment.js";

import Doctor
from "../models/Doctor.js";


const generateSlots =
async (
  doctor,
  date
) => {

  const slots = [];

  const start =
    doctor.workingHours.start;

  const end =
    doctor.workingHours.end;

  const duration =
    doctor.slotDuration;

  const [startHour, startMin] =
    start.split(":").map(Number);

  const [endHour, endMin] =
    end.split(":").map(Number);

  let current =
    startHour * 60 +
    startMin;

  const endTime =
    endHour * 60 +
    endMin;

  while (
    current + duration <=
    endTime
  ) {
    const hours =
      Math.floor(
        current / 60
      );

    const mins =
      current % 60;

    const slot =
      `${String(hours)
        .padStart(2, "0")}:${String(
        mins
      ).padStart(2, "0")}`;

    slots.push(slot);

    current += duration;
  }

  const booked =
    await Appointment.find({
      doctor: doctor._id,
      appointmentDate: date,
      status: "BOOKED"
    });

  const bookedSlots =
    booked.map(
      (item) =>
        item.startTime
    );

  return slots.filter(
    (slot) =>
      !bookedSlots.includes(
        slot
      )
  );
};

export default generateSlots;