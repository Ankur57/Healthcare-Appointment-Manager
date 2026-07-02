import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await api.post(
            "/auth/login",
            formData
          );

        setUser(
          res.data.user
        );

        toast.success(
          "Login successful"
        );

        const role =
          res.data.user.role;

        if (
          role === "admin"
        )
          navigate(
            "/admin/dashboard"
          );

        else if (
          role === "doctor"
        )
          navigate(
            "/doctor/dashboard"
          );

        else
          navigate(
            "/dashboard"
          );
      } catch (error) {
        toast.error(
          error.response.data
            .message
        );
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-center">

      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl">

        <div className="text-center mb-8">
          <FaHeartbeat className="text-blue-600 text-5xl mx-auto" />

          <h1 className="text-4xl font-bold mt-4 text-blue-600">
            MediFlow
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome Back
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-4 border rounded-xl"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 border rounded-xl"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
          />

          <button
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;