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
      toast.error("Please fix the form errors.");
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
    <div className="max-w-md mx-auto py-20">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}
