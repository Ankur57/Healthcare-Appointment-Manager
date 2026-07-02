import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    if (error.response?.status !== 401 || (error.response?.status === 401 && error.config.url !== '/auth/me')) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;