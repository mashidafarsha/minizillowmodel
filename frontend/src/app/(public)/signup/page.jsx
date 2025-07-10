"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../../store/authSlice";
import { useRouter } from "next/navigation";
import { validateSignup } from "@/utils/validation/signupValidation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) => {
        toast.error(msg);
      });
      return;
    }

    try {
      await dispatch(signupUser(form)).unwrap();
      toast.success("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex w-full md:w-1/4 justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
            Zillow Mini Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
            >
              Sign Up
            </button>

            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-semibold"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>

      <div
        className="hidden md:block md:w-3/4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://photos.zillowstatic.com/fp/6351a053c97f83e2e246d7d79c4fcea8-cc_ft_1536.jpg')",
        }}
        aria-label="Signup page image"
      ></div>
    </div>
  );
}
