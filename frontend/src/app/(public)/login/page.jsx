"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUserApi } from "../../../utils/axiosApi/authApi";
import { validateLogin } from "@/utils/validation/loginValidation";
import toast from "react-hot-toast";

export default function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) => {
        toast.error(msg);
      });
      return;
    }

    try {
      const { user, accessToken, refreshToken } = await loginUserApi(form);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userAccessToken", accessToken);
      localStorage.setItem("userRefreshToken", refreshToken);

      localStorage.removeItem("admin");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");

      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error("Login failed: Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex w-full md:w-1/4 justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-green-600">
            Zillow Mini Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600 ${
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
                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition"
            >
              Login
            </button>
            <p className="mt-4 text-center text-gray-600">
              New to Zillow?{" "}
              <a
                href="/signup"
                className="text-green-600 hover:underline font-semibold"
              >
                Create account
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
        aria-label="Login page image"
      ></div>
    </div>
  );
}
