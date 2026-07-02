import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function Register() {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
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
        await api.post(
          "/auth/register",
          formData
        );

        toast.success(
          "Registration Successful"
        );

        navigate(
          "/login"
        );
      } catch (error) {
        toast.error(
          error.response.data
            .message
        );
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-center items-center">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <div className="text-center mb-8">
          <FaHeartbeat className="text-blue-600 text-5xl mx-auto" />

          <h1 className="text-4xl font-bold text-blue-600 mt-4">
            MediFlow
          </h1>

          <p className="text-gray-500">
            Create Account
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-4 border rounded-xl"
            onChange={
              handleChange
            }
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-4 border rounded-xl"
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 border rounded-xl"
            onChange={
              handleChange
            }
          />

          <button
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;