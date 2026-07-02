import api from "./api";

export const getDoctors = async (
  specialization = ""
) => {
  const res = await api.get(
    `/patient/doctors?specialization=${specialization}`
  );

  return res.data.doctors;
};

export const getSlots =
  async (
    doctorId,
    date
  ) => {
    const res =
      await api.get(
        `/patient/doctors/${doctorId}/slots?date=${date}`
      );

    return res.data.slots;
  };

export const bookAppointment =
  async (data) => {
    const res =
      await api.post(
        "/appointments",
        data
      );

    return res.data;
  };