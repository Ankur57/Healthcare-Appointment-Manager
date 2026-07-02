import api from "./api";

export const getMyAppointments =
  async () => {
    const res =
      await api.get(
        "/appointments/my"
      );

    return res.data
      .appointments;
  };

export const cancelAppointment =
  async (id) => {
    const res =
      await api.put(
        `/appointments/cancel/${id}`
      );

    return res.data;
  };