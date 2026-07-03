import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

const generateSlots = async (doctor, date) => {
  const slots = [];
  const start = doctor.workingHours.start;
  const end = doctor.workingHours.end;
  const duration = doctor.slotDuration || 30;

  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  let current = startHour * 60 + startMin;
  const endTimeMin = endHour * 60 + endMin;

  while (current + duration <= endTimeMin) {
    const startH = Math.floor(current / 60);
    const startM = current % 60;
    const startTimeStr = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`;

    const endH = Math.floor((current + duration) / 60);
    const endM = (current + duration) % 60;
    const endTimeStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    slots.push({ startTime: startTimeStr, endTime: endTimeStr });

    current += duration;
  }

  const booked = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: date,
    status: "BOOKED"
  });

  const bookedStartTimes = booked.map((item) => item.startTime);

  let availableSlots = slots.filter((slot) => !bookedStartTimes.includes(slot.startTime));

  const now = new Date();
  const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const todayStr = istNow.toISOString().split('T')[0];
  const dateStr = new Date(date).toISOString().split('T')[0];

  if (dateStr === todayStr) {
    const currentIST = istNow.getHours() * 60 + istNow.getMinutes();
    availableSlots = availableSlots.filter(slot => {
      const [h, m] = slot.startTime.split(':').map(Number);
      return h * 60 + m > currentIST;
    });
  }

  return availableSlots;
};

export default generateSlots;